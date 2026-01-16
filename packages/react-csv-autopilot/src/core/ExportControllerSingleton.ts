import type { ExportController } from "./controllers/ExportController";
import createExportController from "./createExportController";

// biome-ignore lint/complexity/noStaticOnlyClass: Note(Pavlo) Prefer to keep as class
class ExportControllerSingleton {
  static instance: ExportController | null = null;
  static initialized: boolean = false;

  static init() {
    if (ExportControllerSingleton.instance) {
      return ExportControllerSingleton.instance;
    }

    ExportControllerSingleton.instance = createExportController();
    ExportControllerSingleton.initialized = true;

    return ExportControllerSingleton.instance;
  }

  static getInstance(): ExportController {
    if (!ExportControllerSingleton.instance) {
      return ExportControllerSingleton.init();
    }

    return ExportControllerSingleton.instance;
  }
}

export default ExportControllerSingleton;
