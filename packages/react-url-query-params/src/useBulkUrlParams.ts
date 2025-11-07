import {useSearchParams} from 'react-router-dom'
import {useCallback} from 'react'
import type {QueryParamConfig} from "./types.utils";

type BatchUpdateFunction = (params: URLSearchParams) => void

type ParamsRecord = Record<string, string>

function useBulkUrlParams<T extends string, O extends string>(config: QueryParamConfig<T, O | ''>) {
  const [searchParams, setSearchParams] = useSearchParams()
  
  const batchUpdate = useCallback((updateFn: BatchUpdateFunction) => {
    const newParams = new URLSearchParams(searchParams)
    updateFn(newParams)
    setSearchParams(newParams)
  }, [searchParams, setSearchParams])
  
  const replaceSearchParamsWith = useCallback((newParams: ParamsRecord | URLSearchParams) => {
    if (newParams instanceof URLSearchParams) {
      setSearchParams(newParams, {replace: true})
    } else {
      const params = new URLSearchParams()
      
      Object.entries(newParams).forEach(([key, value]) => {
        params.set(key, value)
      })
      
      setSearchParams(params, {replace: true})
    }
  }, [setSearchParams])
  
  const initializeWithParams = useCallback((initialParams: ParamsRecord) => {
    
    Object.entries(initialParams).forEach(([key, value]) => {
      if (!searchParams.has(key)) {
        searchParams.set(key, value)
      }
    });
    
    setSearchParams(searchParams, {replace: true});
  }, [setSearchParams]);
  
  return {batchUpdate, replaceSearchParamsWith, initializeWithParams}
}

export default useBulkUrlParams


