import { useEffect, useState } from 'preact/hooks';
import { padZero } from '../util';

type Props = {
  name: string;
  defaultValue?: number;
  isDecimal?: boolean;
  isSeconds?: boolean;
  modifyBy?: number;
  onChange: (value: number, name: string) => void;
};

export function NumberInput({
  name,
  onChange,
  modifyBy = 1,
  defaultValue = 0,
  isDecimal = false,
  isSeconds = false,
}: Props) {
  const [value, setValue] = useState<FuelInputValue>({
    real: defaultValue,
    display: isDecimal
      ? defaultValue.toFixed(2)
      : isSeconds
      ? padZero(defaultValue)
      : defaultValue.toString(),
  });

  const handleValueChange = (valueDisplay: string, fromSingle = false) => {
    let newDisplay = valueDisplay;
    let newReal = 0;

    const value = isDecimal
      ? Math.round(parseFloat(valueDisplay.replace(',', '.')) * 100) / 100
      : parseInt(valueDisplay, 10);

    if (!isNaN(value)) {
      const defaultMin = isSeconds ? (fromSingle ? 59 : 0) : 0;
      const defaultMax = isSeconds ? (fromSingle ? 0 : 59) : Math.min(0, value);

      if (value < 0) {
        newReal = defaultMin;
        newDisplay = defaultMin.toString();
      } else if (isSeconds && value > 59) {
        newReal = defaultMax;
        newDisplay = defaultMax.toString();
      } else {
        newReal = value;
      }

      newDisplay = fromSingle && isSeconds ? padZero(newReal) : newDisplay;
    }

    setValue({
      display: newDisplay,
      real: newReal,
    });
  };

  const onInput = ({
    currentTarget,
  }: JSX.TargetedEvent<HTMLInputElement, Event>) => {
    handleValueChange(currentTarget.value);
  };

  const onBlur = () => {
    if (!isSeconds) {
      return;
    }

    setValue({
      display: padZero(value.real),
      real: value.real,
    });
  };

  const onInc = () => {
    handleValueChange((value.real + modifyBy).toFixed(isDecimal ? 2 : 0), true);
  };
  const onDec = () => {
    handleValueChange((value.real - modifyBy).toFixed(isDecimal ? 2 : 0), true);
  };

  const onKeyPress = (e: KeyboardEvent) => {
    if (e.code === 'Enter') {
      e.preventDefault();
    }
  };

  useEffect(() => {
    onChange(value.real, name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div class="relative w-fit">
      <input
        type="text"
        id={name}
        name={name}
        class={`${
          isDecimal ? 'w-40' : 'w-32'
        } px-4 py-2 text-4xl border-2 border-red-700 border-opacity-25 rounded-md bg-transparent`}
        value={value.display}
        onInput={onInput}
        onBlur={onBlur}
        onKeyPress={onKeyPress}
      />
      <div class="absolute right-[2px] top-0 grid grid-flow-row gap-[1px] py-[2px] bottom-0">
        <button class="px-4 rounded-tr-sm bg-red-900" onClick={onInc}>
          +
        </button>
        <button class="px-4 rounded-br-sm bg-red-900" onClick={onDec}>
          -
        </button>
      </div>
    </div>
  );
}
