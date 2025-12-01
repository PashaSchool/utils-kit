import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { Capitalize, ParamsConfig } from "./types.utils";
import { upperFirst } from "./utils";

type BatchUrlReturnType<T extends Record<string, readonly string[]>> = {
    set: (values: Partial<{ [K in keyof T]: T[K][number] }>) => void;
} & {
    [K in {
        [Key in keyof T]: {
            [Val in T[Key][number]]: `is${Capitalize<Key & string>}${Capitalize<Val & string>}`;
        }[T[Key][number]];
    }[keyof T]]: boolean;
};

function useBulkUrlParams<const T extends Record<string, readonly string[]>>(
    config: T,
): BatchUrlReturnType<T> {
    const [searchParams, setSearchParams] = useSearchParams();

    type Config = {
        [K in keyof T]: T[K][number];
    };

    const setterFunction = useCallback(
        (values: Partial<Config>, paramsConfig: ParamsConfig = { replace: false }) => {
            const params = new URLSearchParams(searchParams);

            Object.entries(values).forEach(([key, value]) => {
                params.set(key, value);
            });

            setSearchParams(params.toString(), paramsConfig);
        },
        [searchParams, setSearchParams],
    );

    const capitalizedOptions = useMemo(() => {
        const params = new URLSearchParams(searchParams);
        const result = {} as { [key: string]: boolean };

        Object.entries(config).forEach(([key, options]) => {
            const capitalizedKeyName = upperFirst(key);
            const currentValue = params.get(key);

            options.forEach((option) => {
                const capitalizedOption = upperFirst(option);

                Object.assign(result, {
                    [`is${capitalizedKeyName}${capitalizedOption}`]: currentValue === option,
                });
            });
        });

        return result;
    }, [searchParams, config]);

    return {
        set: setterFunction,
        ...capitalizedOptions,
    } as BatchUrlReturnType<T>;
}

export default useBulkUrlParams;
