import {objectsToCSV} from "./utils";

type FormatTypes = {
  dataType: "Date" | "Timestamp" | "Utc";
  applyFormattingType: "DD/MM/YYYY";
};

type Column = {
  key: string;
  header: string;
  format?: FormatTypes;
};

type WorkerMessage = {
  id: string;
  type: "process" | "format";
  columns?: Array<Column>;
  data?: any[];
};

type WorkerSuccess = {
  id: string;
  result: string
}

type WorkerFailure = {
  id: string;
  error: Error
}

type WorkerResponse = WorkerSuccess | WorkerFailure;

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const { id, type, columns, data } = event.data;

  try {
    if (type === "process") {
      // Process CSV data
      // const result = { test: true };
      const csvChunk = objectsToCSV(data)
      self.postMessage({ id, result: csvChunk } as WorkerResponse);
    }
  } catch (error) {
    const _error = error instanceof Error ? error : new Error(String(error));

    self.postMessage({
      id,
      error: _error,
    } as WorkerResponse);
  }
};
