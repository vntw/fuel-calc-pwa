export function calc(values: FuelInputValues): number {
  const lapSeconds = values.lapTimeMinutes * 60 + values.lapTimeSeconds;
  const raceSeconds = values.raceMinutes * 60 + values.raceSeconds;
  const laps = raceSeconds / lapSeconds;

  return laps * values.fuelPerLap + values.extraFuel;
}

export function formatLiters(l: number, exact = false): string {
  return exact
    ? (Math.round((l + 0.00001) * 100) / 100).toString()
    : Math.ceil(l).toString();
}
