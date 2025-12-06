export type ExportParams = {
  fileName: string;
  getNextPage: (offset: number) => Promise<any[]>;
};

export interface ExportStrategy {
  export(params: ExportParams): Promise<any>;
}
