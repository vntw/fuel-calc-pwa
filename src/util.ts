export const padZero = (number: number): string =>
  number.toString().length === 1 ? `0${number}` : number.toString();

export const clamp = (num: number, min: number, max: number) =>
  Math.min(Math.max(num, min), max);

export const formatSecondsToDuration = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${padZero(Math.floor(seconds) % 60)}`;

export const minutesToSeconds = (min: number, sec: number) => min * 60 + sec;
