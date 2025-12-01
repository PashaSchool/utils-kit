export type Capitalize<S extends string> = S extends `${infer F}${infer R}`
    ? `${Uppercase<F>}${R}`
    : S;

export type QueryParamConfig<T extends string, O extends string> = {
    keyName: T;
    options: O[];
};

export type ParamsConfig = { replace: boolean };
