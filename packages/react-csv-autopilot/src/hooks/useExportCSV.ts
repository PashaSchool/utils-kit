import { useRef } from "react";
import { type ExportController, ExportControllerSingleton } from "../core";

function useExportCSV() {
  const exportCallbackRef = useRef<ExportController>(ExportControllerSingleton.init());

  return {
    handler: exportCallbackRef.current!,
  };
}

export default useExportCSV;
