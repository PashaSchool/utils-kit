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

type WorkerResponse = {
  id: string;
  result?: any;
  error?: Error;
};

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const {id, type, columns, data} = event.data;
  
  try {
    if (type === "process") {
      // Process CSV data
      const result = {test: true};
      self.postMessage({id, result} as WorkerResponse);
    }
  } catch (error) {
    const _error = error instanceof Error ? error : new Error(String(error))
    
    self.postMessage({
      id,
      error: _error,
    } as WorkerResponse);
  }
};
