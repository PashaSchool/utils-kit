import type { ExportParams, ExportResponse, ExportStrategy } from "../types";

class BolbExportStrategy implements ExportStrategy {
  export<T>(_params: ExportParams<T>): Promise<ExportResponse> {
    return Promise.resolve({ finished: true, totalRowsLoaded: 10 });
  }
}

export default BolbExportStrategy;
