export const callIfValid = (func: Function, ...args: any[]) => {
  if (typeof func === 'function') func(...args);
};
