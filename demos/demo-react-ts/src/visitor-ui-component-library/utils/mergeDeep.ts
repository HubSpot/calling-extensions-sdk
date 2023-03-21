/**
 * Performs a deep merge of two objects and returns new object. Does not modify
 * objects (immutable) and merges arrays via concatenation.
 * @param targetObj The object to act as the target to be merged onto.
 * @param sourceObj The object to source properties that override the target's.
 * @returns A single merged object.
 */
export function mergeDeep<
  Target = Record<string, unknown>,
  Source = Record<string, unknown>
>(targetObj: Target, sourceObj: Source) {
  const isObject = (obj: any) => obj && typeof obj === 'object';

  return ([targetObj, sourceObj] as Record<string, unknown>[]).reduce(
    (target, source) => {
      Object.keys(source).forEach(key => {
        const targetVal = target[key];
        const sourceVal = source[key];

        if (Array.isArray(targetVal) && Array.isArray(sourceVal)) {
          target[key] = targetVal.concat(...sourceVal);
        } else if (isObject(targetVal) && isObject(sourceVal)) {
          target[key] = mergeDeep(targetVal, sourceVal);
        } else {
          target[key] = sourceVal;
        }
      });

      return target;
    },
    {}
  ) as Target & Source;
}
