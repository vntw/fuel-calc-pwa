import { useEffect, useState } from 'preact/hooks';
import { KEY_PRESETS, load, save } from '../storage';
import { formatLiters } from '../fuel';
import { padZero } from '../util';
import { ComponentChildren } from 'preact';
import { Box } from './box';

type Props = {
  onPopulate: (values: FuelInputValues) => void;
};

export function Presets({ onPopulate }: Props) {
  const [presets, setPresets] = useState<Array<FuelInputPreset> | null>(null);

  useEffect(() => {
    const data = load(KEY_PRESETS);

    setPresets(Array.isArray(data) ? data : []);
  }, []);

  const deletePreset = (idx: number) => () => {
    if (!presets) {
      return;
    }

    const newPresets = [...presets.slice(0, idx), ...presets.slice(idx + 1)];

    save('fc-input-presets', newPresets);
    setPresets(newPresets);
  };

  if (presets === null) {
    return null;
  }

  if (presets.length === 0) {
    return (
      <div class="py-16 text-center text-gray-300">No presets available</div>
    );
  }

  const renderValue = (label: string, value: ComponentChildren) => (
    <div class="inline-flex flex-row rounded-md bg-gray-700">
      <span class="px-2 py-1 uppercase">{label}</span>
      <span class="bg-opacity-75 bg-red-900 px-2 py-1 font-bold">{value}</span>
    </div>
  );

  return (
    <section class="grid grid-cols-1 gap-12 pb-16 md:grid-cols-2">
      {presets.map(({ inputValues: iv, _meta }: FuelInputPreset, i: number) => (
        <Box
          key={`preset-${i}`}
          footer={
            <div class="grid grid-cols-2 gap-x-[2px]">
              <button
                class="btn btn-small rounded-none"
                onClick={() => {
                  onPopulate(iv);
                }}
              >
                Use
              </button>
              <button
                class="btn btn-small bg-opacity-50 flex items-center justify-center rounded-none"
                onClick={deletePreset(i)}
              >
                ⤬
              </button>
            </div>
          }
        >
          <div class="flex-col space-y-8">
            <div class="flex flex-col items-start space-y-2">
              {renderValue(
                'Lap',
                `${iv.lapTimeMinutes}:${padZero(iv.lapTimeSeconds)}`,
              )}
              {renderValue(
                'Race',
                `${iv.raceMinutes}:${padZero(iv.raceSeconds)}`,
              )}
              {renderValue('Fuel/Lap', `${iv.fuelPerLap}`)}
              {renderValue(
                'Formation',
                `${iv.formationLap === 0.5 ? '½' : iv.formationLap}`,
              )}
              {renderValue('Post Race', `${iv.postRaceLap}`)}
              {renderValue(
                'Result',
                <>
                  {formatLiters(_meta.fuelResult)}{' '}
                  <span class="font-normal text-base text-gray-400">
                    l ({formatLiters(_meta.fuelResult, true)})
                  </span>
                </>,
              )}
            </div>
          </div>
        </Box>
      ))}
    </section>
  );
}
