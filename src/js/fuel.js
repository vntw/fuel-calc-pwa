export function calc(lapMins, lapSecs, raceMins, raceSecs, fuelPerLap) {
  if (
    isNaN(lapMins) ||
    isNaN(lapSecs) ||
    (lapMins <= 0 && lapSecs <= 0) ||
    isNaN(raceMins) ||
    isNaN(raceSecs) ||
    (raceMins <= 0 && raceSecs <= 0) ||
    isNaN(fuelPerLap) ||
    fuelPerLap <= 0
  ) {
    return null;
  }

  const lapSeconds = lapMins * 60 + lapSecs;
  const raceSeconds = raceMins * 60 + raceSecs;
  const laps = raceSeconds / lapSeconds;
  const risky = laps * fuelPerLap;
  const safe = (laps + 3) * fuelPerLap;

  return { risky, safe };
}

export function formatLiters(l) {
  return Math.round((l + 0.00001) * 100) / 100;
}
