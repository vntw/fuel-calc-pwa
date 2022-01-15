//eslint-disable-next-line @typescript-eslint/no-explicit-any
export function save(key: string, data: any) {
  localStorage.setItem(key, JSON.stringify(data));
}

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export function load(key: string): any {
  const d = localStorage.getItem(key);

  if (!d) {
    return null;
  }

  try {
    return JSON.parse(d);
  } catch (e) {
    return null;
  }
}
