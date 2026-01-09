import type { ExportController } from "./controllers/ExportController";
import { ExportControlFabric } from "./fabric/ExportControlFabric";

class ExportControllerSingleton {
  static instance: ExportController | null = null;
  static initialized: boolean = false;

  static init() {
    if (ExportControllerSingleton.instance) {
      return ExportControllerSingleton.instance;
    }

    ExportControllerSingleton.instance = ExportControlFabric.create();
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
