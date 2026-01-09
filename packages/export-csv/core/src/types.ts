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
