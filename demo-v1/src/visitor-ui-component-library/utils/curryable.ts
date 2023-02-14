export const curryable = (func: Function) => {
  const curry: Function = (...args: any[]) => {
    return args.length >= func.length
      ? func.apply(null, args)
      : curry.bind(null, ...args);
  };
  return curry;
};
