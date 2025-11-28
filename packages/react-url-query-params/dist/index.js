// src/useUrlParams.ts
import { useSearchParams } from "react-router-dom";
import { useCallback, useMemo } from "react";

// src/utils.ts
var upperFirst = (s) => s ? s[0].toUpperCase() + s.slice(1) : s;

// src/useUrlParams.ts
function useUrlParams(config) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentValue = searchParams.get(config.keyName);
  const setterFunction = useCallback(
    (newValue) => {
      if (config.options.includes(newValue)) {
        const params = new URLSearchParams(searchParams.toString());
        params.set(config.keyName, newValue);
        setSearchParams([...params]);
      }
      if (!newValue) {
        const params = new URLSearchParams(searchParams.toString());
        params.delete(config.keyName);
      }
    },
    [config.keyName, config.options, searchParams, setSearchParams]
  );
  const onToggle = useCallback(() => {
    if (config.options.length !== 2) {
      console.warn("onToggle is only available when there are exactly two options");
      return;
    }
    let currentOptionIndex = config.options.indexOf(currentValue);
    let nextOption;
    if (currentOptionIndex !== -1) {
      const nextIndex = (currentOptionIndex + 1) % config.options.length;
      nextOption = config.options[nextIndex];
    } else {
      nextOption = config.options[0];
    }
    setterFunction(nextOption);
  }, [config.options, currentValue, setterFunction]);
  const clearParam = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (params.has(config.keyName)) {
      params.delete(config.keyName);
      setSearchParams([...params]);
    }
  }, [config.options, searchParams]);
  const capitalizedOptions = useMemo(() => {
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

// src/useBatchUrlParams.ts
import { useSearchParams as useSearchParams2 } from "react-router-dom";
import { useCallback as useCallback2, useMemo as useMemo2 } from "react";
function useBatchUrlParams(config) {
  const [searchParams, setSearchParams] = useSearchParams2();
  const setterFunction = useCallback2((values) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(values).forEach(([key, value]) => {
      params.set(key, value);
    });
    setSearchParams(params.toString(), { replace: false });
  }, [searchParams]);
  const capitalizedOptions = useMemo2(() => {
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
var useBatchUrlParams_default = useBatchUrlParams;
export {
  useBatchUrlParams_default as useBatchUrlParams,
  useUrlParams_default as useUrlParams
};
