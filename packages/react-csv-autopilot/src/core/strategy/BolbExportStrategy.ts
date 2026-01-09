import type { ExportParams, ExportStrategy } from "../types";

class BolbExportStrategy implements ExportStrategy {
  export(params: ExportParams): Promise<any> {
    return Promise.resolve({});
  }
}

export default BolbExportStrategy;
