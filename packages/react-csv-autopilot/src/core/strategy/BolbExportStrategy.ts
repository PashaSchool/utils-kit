import type { ExportParams, ExportStrategy } from "../types";

class BolbExportStrategy implements ExportStrategy {
  export(_params: ExportParams): Promise<any> {
    return Promise.resolve({});
  }
}

export default BolbExportStrategy;
