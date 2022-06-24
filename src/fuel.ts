import { minutesToSeconds } from './util';

export function calc(values: FuelInputValues): number {
  const lapSeconds = minutesToSeconds(
    values.lapTimeMinutes,
    values.lapTimeSeconds,
  );
  const raceSeconds = minutesToSeconds(values.raceMinutes, values.raceSeconds);

  if (lapSeconds <= 0 || raceSeconds <= 0 || values.fuelPerLap <= 0) {
    return 0;
  }

  const laps = raceSeconds / lapSeconds;

  return laps * values.fuelPerLap + values.extraFuel;
}

export function formatLiters(l: number, exact = false): string {
  return exact
    ? (Math.round((l + 0.00001) * 100) / 100).toString()
    : Math.ceil(l).toString();
}
