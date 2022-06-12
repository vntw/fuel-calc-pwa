import { useEffect } from 'preact/hooks';
import { clamp } from '../util';

type Props = {
  name: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  scaleLabels?: (
    min: number,
    max: number,
  ) => Array<{ pos: number; label: string }>;
};

const scaleLabel = (pos: number, label: string) => (
  <span
    className="absolute top-0 -translate-x-1/2 after:absolute after:-top-1 after:left-1/2 after:inline-block after:h-[6px] after:w-[1px] after:bg-white/50 after:content-['']"
    style={{
      left: `${pos}%`,
    }}
  >
    {label}
  </span>
);

export function RangeInput({
  name,
  value,
  min,
  max,
  step,
  onChange,
  scaleLabels,
}: Props) {
  const handleValueChange = ({
    currentTarget,
  }: JSX.TargetedEvent<HTMLInputElement, Event>) => {
    onChange(clamp(currentTarget.valueAsNumber, min, max));
  };

  useEffect(() => {
    const clamped = clamp(value, min, max);

    if (clamped !== value) {
      onChange(clamped);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, onChange]);

  const labels = scaleLabels ? scaleLabels(min, max) : [];

  return (
    <div class="relative flex w-full flex-row items-center gap-6">
      <output class="relative flex select-none whitespace-nowrap text-center text-4xl">
        <span class="invisible">99.99l</span>
        <span className="absolute inset-0 tabular-nums">
          {value.toFixed(2)}l
        </span>
      </output>
      <div class="w-full space-y-2">
        <input
          type="range"
          id={name}
          name={name}
          min={min}
          max={max}
          step={step}
          class={`block h-[12px] w-full appearance-none bg-gradient-to-r from-[#991b1b] to-[red] bg-no-repeat transition-[background-size]`}
          style={{
            backgroundSize: `${((value / max) * 100).toFixed(0)}% 100%`,
          }}
          value={value}
          onInput={handleValueChange}
        />
        {labels.length > 0 && (
          <ul class="relative block text-sm">
            {labels.map(({ pos, label }) => (
              <li key={pos}>{scaleLabel(pos, label)}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
