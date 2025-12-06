type Capitalize<S extends string> = S extends `${infer F}${infer R}` ? `${Uppercase<F>}${R}` : S;
type QueryParamConfig<T extends string, O extends string> = {
  keyName: T;
  options: O[];
};

type BatchUrlReturnType<T extends Record<string, readonly string[]>> = {
  set: (
    values: Partial<{
      [K in keyof T]: T[K][number];
    }>,
  ) => void;
} & {
  [K in {
    [Key in keyof T]: {
      [Val in T[Key][number]]: `is${Capitalize<Key & string>}${Capitalize<Val & string>}`;
    }[T[Key][number]];
  }[keyof T]]: boolean;
};
declare function useBulkUrlParams<const T extends Record<string, readonly string[]>>(
  config: T,
): BatchUrlReturnType<T>;

type QueryParamHookResult<T extends string, O extends string> = {
  [K in O as `is${Capitalize<T>}${Capitalize<K>}`]: boolean;
} & {
  [K in `set${Capitalize<T>}`]: (value: O) => void;
} & {
  [K in T]: O | null;
} & {
  [K in `toggle${Capitalize<T>}`]: () => void;
} & {
  [K in `clear${Capitalize<T>}`]: () => void;
};
declare function useUrlParams<T extends string, O extends string>(
  config: QueryParamConfig<T, O>,
): QueryParamHookResult<T, O>;

export { useBulkUrlParams as useBatchUrlParams, useUrlParams };
