type Column = { key: string, label: string, format?: FormatTypes };

export type ExportParams = {
  fileName: string;
  columns: Column[]
  getNextPage: (offset: number) => Promise<any[]>;
};


export interface ExportStrategy {
  export(params: ExportParams): Promise<any>;
}

type FormatTypes = {
  dataType: "Date" | "Timestamp" | "Utc";
  applyFormattingType: "DD/MM/YYYY";
};


export type WorkerMessage = {
  id: string;
  type: "process" | "format" | "complete";
  columns?: Array<Column>;
  data?: any[];
};

type WorkerSuccess = {
  id: string;
  result: string;
  type: string;
};

type WorkerFailure = {
  id: string;
  error: Error;
  type: string;
};

export type WorkerResponse = WorkerSuccess | WorkerFailure;
