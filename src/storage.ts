import joi, { ValidationOptions } from 'joi';

export const KEY_CURRENT_VALUES = 'fc-input-values';
export const KEY_PRESETS = 'fc-input-presets';

type KEYS = typeof KEY_CURRENT_VALUES | typeof KEY_PRESETS;

const valuesSchema = joi.object({
  lapTimeMinutes: joi.number(),
  lapTimeSeconds: joi.number(),
  raceMinutes: joi.number(),
  raceSeconds: joi.number(),
  fuelPerLap: joi.number(),
  extraFuel: joi.number(),
});

const presetsSchema = joi.array().items(
  joi.object({
    inputValues: valuesSchema,
    _meta: joi.object({
      createdAt: joi.date(),
      fuelResult: joi.number(),
    }),
  }),
);

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export function save(key: string, data: any) {
  localStorage.setItem(key, JSON.stringify(data));
}

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export function load(key: KEYS): any {
  const d = localStorage.getItem(key);

  if (!d) {
    return null;
  }

  try {
    return validateSchema(key, JSON.parse(d));
  } catch (e) {
    return null;
  }
}

function validateSchema(key: KEYS, data: unknown) {
  const validateOptions: ValidationOptions = {
    presence: 'required',
    dateFormat: 'iso',
  };
  let result;

  switch (key) {
    case KEY_CURRENT_VALUES: {
      result = valuesSchema.validate(data, validateOptions);
      break;
    }
    case KEY_PRESETS: {
      result = presetsSchema.validate(data, validateOptions);
      break;
    }
  }

  return result === undefined || result.error ? null : result.value;
}
