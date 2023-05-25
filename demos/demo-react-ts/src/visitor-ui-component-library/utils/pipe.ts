export function pipe<T>(...functions: Array<(arg: T) => T>) {
  return (data: T) => functions.reduce((acc, func) => func(acc), data);
}
