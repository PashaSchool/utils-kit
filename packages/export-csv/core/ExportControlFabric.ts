import {ExportParams} from "./types";
import {ExportController} from "./ExportController";
import FsAccessExportStrategy from "./FsAccessExportStrategy";
import BolbExportStrategy from "./BolbExportStrategy";

class ExportControlFabric {
  static create(params: ExportParams): ExportController {
    const controller = new ExportController({
      fsAccessStrategy: new FsAccessExportStrategy(),
      blobExportStrategy: new BolbExportStrategy(),
    })
    
    return controller
  }
}

export default ExportControlFabric
