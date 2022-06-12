export const padZero = (number: number): string =>
  number.toString().length === 1 ? `0${number}` : number.toString();

export const clamp = (num: number, min: number, max: number) =>
  Math.min(Math.max(num, min), max);
