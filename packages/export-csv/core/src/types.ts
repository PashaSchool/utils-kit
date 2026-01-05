export type ExportParams = {
  fileName: string;
  getNextPage: (offset: number) => Promise<any[]>;
};

export interface ExportStrategy {
  export(params: ExportParams): Promise<any>;
}

type FormatTypes = {
  dataType: "Date" | "Timestamp" | "Utc";
  applyFormattingType: "DD/MM/YYYY";
};

type Column = {
  key: string;
  header: string;
  format?: FormatTypes;
};

export type WorkerMessage = {
  id: string;
  type: "process" | "format";
  columns?: Array<Column>;
  data?: any[];
};

type WorkerSuccess = {
  id: string;
  result: string;
};

type WorkerFailure = {
  id: string;
  error: Error;
};

export type WorkerResponse = WorkerSuccess | WorkerFailure;
