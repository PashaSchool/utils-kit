import { ExportController } from "./controllers/ExportController";
import BolbExportStrategy from "./strategy/BolbExportStrategy";
import FsAccessExportStrategy from "./strategy/FsAccessExportStrategy";

function createExportController(): ExportController {
  return new ExportController({
    blobExportStrategy: new BolbExportStrategy(),
    fsAccessStrategy: new FsAccessExportStrategy(),
  });
}

export default createExportController;
