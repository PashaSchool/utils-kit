import type BolbExportStrategy from "../strategy/BolbExportStrategy";
import type FsAccessExportStrategy from "../strategy/FsAccessExportStrategy";
import type { ExportParams, ExportStrategy } from "../types";

type ExportControllerDeps = {
  fsAccessStrategy: FsAccessExportStrategy;
  blobExportStrategy: BolbExportStrategy;
};

export class ExportController {
  constructor(private readonly deps: ExportControllerDeps) {}

  public async start<T>(params: ExportParams<T>): Promise<any> {
    const strategy = this.#resolveStrategy<T>();

    return strategy.export(params);
  }

  #canUseFSAccess() {
    return typeof window.showSaveFilePicker === "function";
  }

  #resolveStrategy<T>(): ExportStrategy<T> {
    if (this.#canUseFSAccess()) {
      return this.deps.fsAccessStrategy;
    }

    return this.deps.blobExportStrategy;
  }
}
