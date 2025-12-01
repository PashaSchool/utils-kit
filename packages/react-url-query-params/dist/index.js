// src/useBulkUrlParams.ts
import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

// src/utils.ts
var upperFirst = (s) => s ? s[0].toUpperCase() + s.slice(1) : s;

// src/useBulkUrlParams.ts
function useBulkUrlParams(config) {
  const [searchParams, setSearchParams] = useSearchParams();
  const setterFunction = useCallback(
    (values) => {
      const params = new URLSearchParams(searchParams);
      Object.entries(values).forEach(([key, value]) => {
        params.set(key, value);
      });
      setSearchParams(params.toString(), { replace: false });
    },
    [searchParams, setSearchParams]
  );
  const capitalizedOptions = useMemo(() => {
    const params = new URLSearchParams(searchParams);
    const result = {};
    Object.entries(config).forEach(([key, options]) => {
      const capitalizedKeyName = upperFirst(key);
      const currentValue = params.get(key);
      options.forEach((option) => {
        const capitalizedOption = upperFirst(option);
        Object.assign(result, {
          [`is${capitalizedKeyName}${capitalizedOption}`]: currentValue === option
        });
      });
    });
    return result;
  }, [searchParams, config]);
  return {
    set: setterFunction,
    ...capitalizedOptions
  };
}
var useBulkUrlParams_default = useBulkUrlParams;

// src/useUrlParams.ts
import { useCallback as useCallback2, useMemo as useMemo2 } from "react";
import { useSearchParams as useSearchParams2 } from "react-router-dom";
function useUrlParams(config) {
  const [searchParams, setSearchParams] = useSearchParams2();
  const currentValue = searchParams.get(config.keyName);
  const setterFunction = useCallback2(
    (newValue, paramsConfig = { replace: false }) => {
      if (config.options.includes(newValue)) {
        const params = new URLSearchParams(searchParams.toString());
        params.set(config.keyName, newValue);
        setSearchParams([...params], paramsConfig);
      }
    },
    [config.keyName, config.options, searchParams, setSearchParams]
  );
  const onToggle = useCallback2((paramsConfig = { replace: false }) => {
    if (config.options.length !== 2) {
      console.warn("onToggle is only available when there are exactly two options");
      return;
    }
    const currentOptionIndex = config.options.indexOf(currentValue);
    let nextOption;
    if (currentOptionIndex !== -1) {
      const nextIndex = (currentOptionIndex + 1) % config.options.length;
      nextOption = config.options[nextIndex];
    } else {
      nextOption = config.options[0];
    }
    setterFunction(nextOption, paramsConfig);
  }, [config.options, currentValue, setterFunction]);
  const clearParam = useCallback2((paramsConfig = { replace: false }) => {
    const params = new URLSearchParams(searchParams.toString());
    if (params.has(config.keyName)) {
      params.delete(config.keyName);
      setSearchParams([...params], paramsConfig);
    }
  }, [searchParams, config.keyName, setSearchParams]);
  const capitalizedOptions = useMemo2(() => {
    return config.options.reduce(
      (acc, option) => {
        const capitalizedOption = upperFirst(option);
        const capitalizedKeyName = upperFirst(config.keyName);
        return Object.assign(acc, {
          [`is${capitalizedKeyName}${capitalizedOption}`]: searchParams.get(config.keyName) === option
        });
      },
      {}
    );
  }, [searchParams, config.keyName, config.options]);
  return {
    [config.keyName]: currentValue,
    [`set${upperFirst(config.keyName)}`]: setterFunction,
    [`toggle${upperFirst(config.keyName)}`]: onToggle,
    [`clear${upperFirst(config.keyName)}`]: clearParam,
    ...capitalizedOptions
  };
}
var useUrlParams_default = useUrlParams;
export {
  useBulkUrlParams_default as useBatchUrlParams,
  useUrlParams_default as useUrlParams
};
