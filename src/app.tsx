import { useState } from 'preact/hooks';
import { SvgIcon } from './components/svg-icon';
import historyIcon from './assets/icons/history.svg?raw';
import fuelIcon from './assets/icons/fuel.svg?raw';
import { Calculator } from './components/calculator';

export function App() {
  const [showPresets, setShowPresets] = useState<boolean>(false);

  const toggleShowPresets = () => {
    setShowPresets(!showPresets);
  };

  return (
    <div class="flex flex-col items-center text-gray-300">
      <div class="container flex flex-col">
        <header class="flex flex-row justify-between py-4 items-center">
          <h1 class="text-2xl uppercase cursor-default">Fuel Calculator</h1>
          <button onClick={toggleShowPresets}>
            <SvgIcon
              raw={showPresets ? fuelIcon : historyIcon}
              className="flex w-8 h-8 fill-current"
            />
            <span class="sr-only">
              {showPresets ? 'Show Calculator' : 'Show Presets'}
            </span>
          </button>
        </header>

        <Calculator
          showPresets={showPresets}
          onPresetPopulate={toggleShowPresets}
        />
      </div>
    </div>
  );
}
