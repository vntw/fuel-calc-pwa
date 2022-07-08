import { calc, formatLiters } from './fuel';

const formatLitersData: Array<[number, boolean, string]> = [
  [0, false, '0'],
  [0, true, '0'],
  [1.5, false, '2'],
  [1.5, true, '1.5'],
  [1.595959999, true, '1.6'],
  [1.595959999, false, '2'],
  [42, false, '42'],
  [42, true, '42'],
  [121.143, false, '122'],
  [121.143, true, '121.14'],
];

describe.each(formatLitersData)(`formatLiters`, (input, exact, output) => {
  it(`formats ${input} as ${output}${exact ? ' exactly' : ''}`, () => {
    expect(formatLiters(input, exact)).toBe(output);
  });
});

const calcData: Array<[FuelInputValues, number]> = [
  [
    {
      raceMinutes: 5,
      raceSeconds: 0,
      lapTimeMinutes: 1,
      lapTimeSeconds: 0,
      fuelPerLap: 1,
      extraFuel: 0,
    },
    5,
  ],
  [
    {
      raceMinutes: 5,
      raceSeconds: 0,
      lapTimeMinutes: 1,
      lapTimeSeconds: 0,
      fuelPerLap: .5,
      extraFuel: 0,
    },
    2.5,
  ],
  [
    {
      raceMinutes: 5,
      raceSeconds: 0,
      lapTimeMinutes: 1,
      lapTimeSeconds: 0,
      fuelPerLap: 1,
      extraFuel: 1,
    },
    6,
  ],
  [
    {
      raceMinutes: 5,
      raceSeconds: 30,
      lapTimeMinutes: 1,
      lapTimeSeconds: 30,
      fuelPerLap: 3,
      extraFuel: 3,
    },
    15,
  ],
  [
    {
      raceMinutes: 45,
      raceSeconds: 0,
      lapTimeMinutes: 2,
      lapTimeSeconds: 16,
      fuelPerLap: 3.92,
      extraFuel: 6,
    },
    84.4,
  ],
];

describe.each(calcData)(`calc`, (input, output) => {
  it(`calculates ${JSON.stringify(input)} to ${output}`, () => {
    expect(calc(input)).toBe(output);
  });
});
