export type formatterTypes =
  | "dateFull"
  | "dateMediumTime"
  | "timeShort"
  | "numDecimal"
  | "numCompact"
  | "numCurrency"
  | "numPercent";

export type Column = {
  key: string;
  label: string;
  timezone?: "UTC" | string;
  formatType?: formatterTypes;
};

export type ExportParams = {
  fileName: string;
  columns: Column[];
  getNextPage: (offset: number) => Promise<{ rows: any[]; total: number }>;
};

export interface ExportStrategy {
  export(params: ExportParams): Promise<any>;
}

export type JobId = number & { __brand: "JobId" };

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
