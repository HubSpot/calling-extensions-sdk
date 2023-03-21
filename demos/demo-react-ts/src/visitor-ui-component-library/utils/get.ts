import { curryable } from './curryable';

type dataObject = {
  [key: string]: string;
};
export const get = curryable((key: string, data: dataObject) => data[key]);
