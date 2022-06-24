import { useEffect, useState } from 'preact/hooks';
import { KEY_CURRENT_VALUES, KEY_PRESETS, load, save } from '../storage';
import { calc, formatLiters } from '../fuel';
import { NumberInput } from './number-input';
import { Presets } from './presets';
import { Box } from './box';
import { RangeInput } from './range-input';
import { formatSecondsToDuration, minutesToSeconds, padZero } from '../util';

type Props = {
  showPresets: boolean;
  onPresetPopulate: () => void;
};

export function Calculator({ showPresets, onPresetPopulate }: Props) {
  const [fuelResult, setFuelResult] = useState<number>(0);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [inputValues, setInputValues] = useState<FuelInputValues>({
    lapTimeMinutes: 1,
    lapTimeSeconds: 30,
    raceMinutes: 30,
    raceSeconds: 0,
    fuelPerLap: 3.5,
    extraFuel: 0,
  });
  const [extraFuelRangeOptions, setExtraFuelRangeOptions] = useState({
    step: 0.25,
    min: 0,
    max: 10,
  });
  const [pitStopAt, setPitStopAt] = useState(0);

  useEffect(() => {
    const data = load(KEY_CURRENT_VALUES);

    if (data) {
      setInputValues(data);
    }

    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    setFuelResult(calc(inputValues));
    save(KEY_CURRENT_VALUES, inputValues);

    setExtraFuelRangeOptions({
      ...extraFuelRangeOptions,
      max: Math.max(5, Math.ceil(inputValues.fuelPerLap * 4)),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValues]);

  const onNumberInput = (value: number, name: string) => {
    setInputValues({ ...inputValues, [name]: value });
  };

  const saveAsPreset = () => {
    const currentPresets = load(KEY_PRESETS);

    save(KEY_PRESETS, [
      {
        inputValues,
        _meta: {
          createdAt: new Date().toISOString(),
          fuelResult,
        },
      },
      ...(Array.isArray(currentPresets) ? currentPresets : []),
    ]);
  };

  if (!loaded) {
    return null;
  }

  if (showPresets) {
    return (
      <Presets
        onPopulate={(values: FuelInputValues) => {
          setInputValues(values);
          onPresetPopulate();
        }}
      />
    );
  }

  return (
    <main class={`flex flex-col gap-6 pb-28`}>
      <form
        action=""
        class={`grid grid-cols-1 gap-4 md:grid-cols-2`}
        onSubmit={(e) => {
          e.preventDefault();
          return false;
        }}
      >
        <Box header="Lap Time">
          <label for="lapTimeMinutes" class="sr-only">
            Lap Time Minutes
          </label>
          <NumberInput
            name="lapTimeMinutes"
            defaultValue={inputValues.lapTimeMinutes}
            onChange={onNumberInput}
          />
          <label for="lapTimeSeconds" class="sr-only">
            Lap Time Seconds
          </label>
          <NumberInput
            name="lapTimeSeconds"
            defaultValue={inputValues.lapTimeSeconds}
            isSeconds
            onChange={onNumberInput}
          />
        </Box>
        <Box header="Race Time">
          <label for="raceMinutes" class="sr-only">
            Race Minutes
          </label>
          <NumberInput
            name="raceMinutes"
            defaultValue={inputValues.raceMinutes}
            onChange={onNumberInput}
            modifyBy={5}
          />
          <label for="raceSeconds" class="sr-only">
            Race Seconds
          </label>
          <NumberInput
            name="raceSeconds"
            defaultValue={inputValues.raceSeconds}
            isSeconds
            onChange={onNumberInput}
          />
        </Box>
        <Box header="Fuel Per Lap">
          <label for="fuelPerLap" class="sr-only">
            Fuel Per Lap
          </label>
          <NumberInput
            name="fuelPerLap"
            defaultValue={inputValues.fuelPerLap}
            isDecimal
            onChange={onNumberInput}
            modifyBy={0.15}
          />
        </Box>
        <Box header="Extra Fuel">
          <div class="flex w-full flex-col items-start space-y-2 space-x-0">
            <div class="flex w-full flex-col justify-center">
              <RangeInput
                name="extraFuel"
                value={inputValues.extraFuel}
                step={extraFuelRangeOptions.step}
                min={extraFuelRangeOptions.min}
                max={extraFuelRangeOptions.max}
                onChange={(value) => {
                  onNumberInput(value, 'extraFuel');
                }}
                scaleLabels={(min, max) => {
                  const labels = [
                    { pos: 0, label: `${formatLiters(min, true)}l` },
                    {
                      pos: 100,
                      label: `${formatLiters(max, true)}l`,
                    },
                  ];

                  const fpl =
                    inputValues.fuelPerLap > 0 ? inputValues.fuelPerLap : 1;

                  for (
                    let i = 1;
                    i <= Math.max(Math.floor(max / fpl) - 1, 1);
                    i++
                  ) {
                    labels.push({
                      pos: ((i * fpl) / max) * 100,
                      label: `${formatLiters(i * fpl, true)}l`,
                    });
                  }

                  return labels;
                }}
              />
            </div>
          </div>
        </Box>
      </form>

      <div class="flex items-center self-center">
        <button class="btn btn-wide" onClick={saveAsPreset}>
          Save Preset
        </button>
      </div>

      <Box header="Pit Stop Refuel" secondary>
        <RangeInput
          mobileWrap
          name="pitStopAt"
          value={pitStopAt}
          step={1}
          min={0}
          max={minutesToSeconds(
            inputValues.raceMinutes,
            inputValues.raceSeconds,
          )}
          onChange={(value) => {
            setPitStopAt(value);
          }}
          renderValue={(value) => {
            const raceSeconds = minutesToSeconds(
              inputValues.raceMinutes,
              inputValues.raceSeconds,
            );
            const before = (value / raceSeconds) * fuelResult;
            const after = fuelResult - before;

            return (
              <div class="grid w-max grid-cols-2 gap-y-0.5 gap-x-4 text-left text-base tabular-nums text-gray-400">
                <div class="text-lg text-gray-50">Race Time</div>
                <div class="text-left text-lg text-gray-50">
                  {formatSecondsToDuration(value)}
                </div>
                <div>Previous</div>
                <div class="text-left">{formatLiters(before, true)}l</div>
                <div class="text-xl font-bold text-gray-50">Refuel</div>
                <div class="text-left text-xl font-bold text-green-500">
                  {formatLiters(after, true)}l
                </div>
              </div>
            );
          }}
          scaleLabels={() => {
            const raceSeconds = minutesToSeconds(
              inputValues.raceMinutes,
              inputValues.raceSeconds,
            );
            const prog25 = raceSeconds * 0.25;
            const prog50 = raceSeconds * 0.5;
            const prog75 = raceSeconds * 0.75;

            return [
              { pos: 0, label: '0:00' },
              {
                pos: 25,
                label: formatSecondsToDuration(prog25),
              },
              {
                pos: 50,
                label: formatSecondsToDuration(prog50),
              },
              {
                pos: 75,
                label: formatSecondsToDuration(prog75),
              },
              {
                pos: 100,
                label: `${inputValues.raceMinutes}:${padZero(
                  inputValues.raceSeconds,
                )}`,
              },
            ];
          }}
        />
      </Box>

      <output class="fixed bottom-0 left-0 flex w-full flex-row justify-center space-x-32 overflow-y-hidden overflow-x-scroll border-t-2 border-t-[#7e1e2038] bg-[#131313f0] py-4">
        <div class="flex flex-row items-center justify-center space-x-4">
          <div class="whitespace-nowrap text-5xl font-bold tabular-nums text-green-500">
            {formatLiters(fuelResult)}
            <span className="font-serif font-normal text-gray-500"> l</span>
          </div>
          <div class="text-3xl tabular-nums leading-none text-gray-500">
            [<span class="text-gray-400">{formatLiters(fuelResult, true)}</span>
            ]
          </div>
        </div>
      </output>
    </main>
  );
}
