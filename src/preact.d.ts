// eslint-disable-next-line @typescript-eslint/no-unused-vars
import JSX = preact.JSX;

declare module 'virtual:pwa-register' {
  export type RegisterSWOptions = {
    immediate?: boolean;
    onNeedRefresh?: () => void;
    onOfflineReady?: () => void;
    onRegistered?: (
      registration: ServiceWorkerRegistration | undefined,
    ) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onRegisterError?: (error: any) => void;
  };

  export function registerSW(
    options?: RegisterSWOptions,
  ): (reloadPage?: boolean) => Promise<void>;
}

type FuelInputPreset = {
  inputValues: FuelInputValues;
  _meta: {
    date: string;
    fuelResult: number;
  };
};

type FuelInputValues = {
  lapTimeMinutes: number;
  lapTimeSeconds: number;
  raceMinutes: number;
  raceSeconds: number;
  fuelPerLap: number;
  extraFuel: number;
};

type FuelInputValue = {
  real: number;
  display: string;
};
