import { Runtype, Static, Success, Failure } from "runtypes";
/**
 * Size limit in megabytes.
 */
export const SIZE_LIMIT = 20;
export const MAX_SONGS = 500;
export type DecodeResult<T> = (Success<T> | Failure) & {
  _unsafeUnwrap: () => T;
};
export const decode = <V extends Runtype<any>>(
  data: unknown,
  record: V
): DecodeResult<Static<V>> => {
  const result = record.validate(data);
  if (result.success) {
    return {
      ...result,
      _unsafeUnwrap: () => result.value,
    };
  } else {
    return {
      ...result,
      _unsafeUnwrap: () => {
        throw Error(
          `${result.message}${result.code ? ` (${result.code})` : ""}`
        );
      },
    };
  }
};
export const isDefined = <T>(value: T | undefined | null): value is T =>
  value !== null && value !== undefined;
export const fromEntries = <T extends string, V>(
  iterable: Array<[T, V]>
): Record<T, V> => {
  return [...iterable].reduce((obj, [key, val]) => {
    (obj as any)[key] = val;
    return obj;
  }, {}) as Record<T, V>;
};
