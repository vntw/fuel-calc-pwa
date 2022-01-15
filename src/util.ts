export function padZero(number: number): string {
  return number.toString().length === 1 ? `0${number}` : number.toString();
}
