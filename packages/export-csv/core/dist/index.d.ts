type ExportParams = {
  fileName: string;
  getNextPage: (offset: number) => Promise<any[]>;
};
interface ExportStrategy {
  export(params: ExportParams): Promise<any>;
}

declare class BolbExportStrategy implements ExportStrategy {
  export(params: ExportParams): Promise<any>;
}

declare class FsAccessExportStrategy implements ExportStrategy {
  private workerManager;
  constructor();
  export(params: ExportParams): Promise<any>;
}

type ExportControllerDeps = {
  fsAccessStrategy: FsAccessExportStrategy;
  blobExportStrategy: BolbExportStrategy;
};
declare class ExportController {
  private readonly deps;
  constructor(deps: ExportControllerDeps);
  start(params: ExportParams): Promise<any>;
  private _canUseFSAccess;
  private _resolveStrategy;
}

declare class ExportControlFabric {
  static create(): ExportController;
}

declare class ExportControllerSingleton {
  static instance: ExportController | null;
  static initialized: boolean;
  static init(): ExportController;
  static getInstance(): ExportController;
}

export { ExportControlFabric, ExportController, ExportControllerSingleton };
