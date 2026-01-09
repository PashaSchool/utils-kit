type Column = { key: string; label: string; format?: FormatTypes };

export type ExportParams = {
  fileName: string;
  columns: Column[];
  getNextPage: (offset: number) => Promise<any[]>;
};

export interface ExportStrategy {
  export(params: ExportParams): Promise<any>;
}

type FormatTypes = {
  dataType: "Date" | "Timestamp" | "Utc";
  applyFormattingType: "DD/MM/YYYY";
};

export type JobId = string & { readonly __brand: unique symbol };


export type ToCSVChunkMessage = {
  id: JobId;
  type: "to_csv_chunk";
  columns: Array<{ key: string; label: string }>;
  data: Array<Record<string, unknown>>;
};

type ToCompleteMessage = {
  id: JobId;
  type: "completed";
};

export type ToWorkerMessage = ToCSVChunkMessage | ToCompleteMessage;

type FromWorkerChunkMessage = {
  id: JobId;
  result: string;
  type: "csv_chunk";
};

type FromWorkerDoneMessage = {
  id: JobId;
  type: "done";
};

type ErrorPayload = {
  name: string;
  message: string;
  stuck: string;
};
type FromWorkerFailureMessage = {
  id: JobId;
  type: "error";
  error: ErrorPayload;
};

export type FromWorkerMessage =
  | FromWorkerDoneMessage
  | FromWorkerFailureMessage
  | FromWorkerChunkMessage;
