"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  useBatchUrlParams: () => useBatchUrlParams_default,
  useUrlParams: () => useUrlParams_default
});
module.exports = __toCommonJS(index_exports);

// src/useUrlParams.ts
var import_react_router_dom = require("react-router-dom");
var import_react = require("react");

// src/utils.ts
var upperFirst = (s) => s ? s[0].toUpperCase() + s.slice(1) : s;

// src/useUrlParams.ts
function useUrlParams(config) {
  const [searchParams, setSearchParams] = (0, import_react_router_dom.useSearchParams)();
  const currentValue = searchParams.get(config.keyName);
  const setterFunction = (0, import_react.useCallback)(
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
  const onToggle = (0, import_react.useCallback)(() => {
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
  const clearParam = (0, import_react.useCallback)(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (params.has(config.keyName)) {
      params.delete(config.keyName);
      setSearchParams([...params]);
    }
  }, [config.options, searchParams]);
  const capitalizedOptions = (0, import_react.useMemo)(() => {
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
var import_react_router_dom2 = require("react-router-dom");
var import_react2 = require("react");
function useBatchUrlParams(config) {
  const [searchParams, setSearchParams] = (0, import_react_router_dom2.useSearchParams)();
  const setterFunction = (0, import_react2.useCallback)((values) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(values).forEach(([key, value]) => {
      params.set(key, value);
    });
    setSearchParams(params.toString(), { replace: false });
  }, [searchParams]);
  const capitalizedOptions = (0, import_react2.useMemo)(() => {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useBatchUrlParams,
  useUrlParams
});
