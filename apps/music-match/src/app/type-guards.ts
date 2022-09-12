export function isNotUndefined<T>(object: T | undefined): object is T {
  return !!object;
}
