import {ExportParams, ExportStrategy} from "./types";
import FsAccessExportStrategy from "./FsAccessExportStrategy";
import BolbExportStrategy from "./BolbExportStrategy";

type ExportControllerDeps = {
  fsAccessStrategy?: FsAccessExportStrategy;
  blobExportStrategy?: BolbExportStrategy;
}

export class ExportController {
  constructor(private readonly deps: ExportControllerDeps) {
  }
  
  async start(params: ExportParams): Promise<any> {
    const strategy = this._resolveStrategy(params);
    
    return strategy.export(params);
  }
  
  private _canUseFSAccess() {
    return typeof showSaveFilePicker === 'function'
  }
  
  private _resolveStrategy(params: ExportParams): ExportStrategy | undefined {
    if (this._canUseFSAccess()) {
      return this.deps.fsAccessStrategy
    }
    
    return this.deps.blobExportStrategy
  }
}


