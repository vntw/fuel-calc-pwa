import { useEffect, useState } from 'preact/hooks';
import { KEY_CURRENT_VALUES, KEY_PRESETS, load, save } from '../storage';
import { calc, formatLiters } from '../fuel';
import { NumberInput } from './number-input';
import { Presets } from './presets';
import { Box } from './box';

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
    formationLap: 0,
    postRaceLap: 0,
  });

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValues]);

  const onNumberInput = (value: number, name: string) => {
    setInputValues({ ...inputValues, [name]: value });
  };

  const onRadioInput = ({
    currentTarget,
  }: JSX.TargetedEvent<HTMLInputElement, Event>) => {
    setInputValues({
      ...inputValues,
      [currentTarget.name]: parseFloat(currentTarget.value),
    });
  };

  const saveAsPreset = () => {
    const currentPresets = load(KEY_PRESETS);
    const newPresets = Array.isArray(currentPresets) ? currentPresets : [];
    newPresets.push({
      inputValues,
      _meta: {
        createdAt: new Date().toDateString(),
        fuelResult,
      },
    });

    save(KEY_PRESETS, newPresets);
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
    <main class="pb-28">
      <form
        action=""
        class="grid grid-cols-1 md:grid-cols-2 gap-4"
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
        <Box header="Formation Lap">
          <div class="flex flex-col space-y-2 space-x-0 items-start">
            <label class="space-x-2">
              <input
                type="radio"
                name="formationLap"
                value={0}
                checked={inputValues.formationLap === 0}
                onInput={onRadioInput}
              />
              <span>No lap</span>
            </label>
            <label class="space-x-2">
              <input
                type="radio"
                name="formationLap"
                value={0.5}
                checked={inputValues.formationLap === 0.5}
                onInput={onRadioInput}
              />
              <span>½ lap</span>
            </label>
            <label class="space-x-2">
              <input
                type="radio"
                name="formationLap"
                value={1}
                checked={inputValues.formationLap === 1}
                onInput={onRadioInput}
              />
              <span>1 lap</span>
            </label>
          </div>
        </Box>
        <Box header="Post Race Lap">
          <div class="flex flex-col space-y-2 space-x-0 items-start">
            <label class="space-x-2">
              <input
                type="radio"
                name="postRaceLap"
                value={0}
                checked={inputValues.postRaceLap === 0}
                onInput={onRadioInput}
              />
              <span>No</span>
            </label>
            <label class="space-x-2">
              <input
                type="radio"
                name="postRaceLap"
                value={1}
                checked={inputValues.postRaceLap === 1}
                onInput={onRadioInput}
              />
              <span>Yes</span>
            </label>
          </div>
        </Box>
        <div class="flex items-center">
          <button class="btn btn-wide" onClick={saveAsPreset}>
            Save Preset
          </button>
        </div>
      </form>

      <div class="w-full fixed bottom-0 left-0 py-4 flex flex-row space-x-32 bg-[#131313f0] border-t-2 border-t-[#7e1e2038] justify-center overflow-x-scroll overflow-y-hidden">
        <div class="flex flex-row justify-center items-center space-x-4">
          <div class="font-bold text-5xl text-green-500 whitespace-nowrap">
            {formatLiters(fuelResult)}
            <span className="font-serif font-normal text-gray-500"> l</span>
          </div>
          <div class="text-3xl text-gray-500 leading-none">
            [<span class="text-gray-400">{formatLiters(fuelResult, true)}</span>
            ]
          </div>
        </div>
      </div>
    </main>
  );
}
