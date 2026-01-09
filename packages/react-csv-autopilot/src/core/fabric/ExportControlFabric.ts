import { ExportController } from "../controllers/ExportController";
import BolbExportStrategy from "../strategy/BolbExportStrategy";
import FsAccessExportStrategy from "../strategy/FsAccessExportStrategy";

export class ExportControlFabric {
  static create(): ExportController {
    const controller = new ExportController({
      fsAccessStrategy: new FsAccessExportStrategy(),
      blobExportStrategy: new BolbExportStrategy(),
    });

    return controller;
  }
}
