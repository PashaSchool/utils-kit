import type { ExportParams, ExportStrategy } from "../types";
import WorkerManager from "../WorkerManager";

class FsAccessExportStrategy implements ExportStrategy {
  private workerManager: WorkerManager;

  constructor() {
    this.workerManager = WorkerManager.initialise();
  }

  async export(params: ExportParams): Promise<any> {
    const _suggestedName = params?.fileName || "export";

    const fileHandle = await window.showSaveFilePicker({
      suggestedName: _suggestedName,
      types: [{ description: "CSV file", accept: { "text/csv": [".csv"] } }],
    });

    const writableFileStream = await fileHandle.createWritable();
    let iterator = 0;

    const encoder = new TextEncoder();
    const messaging = new BroadcastChannel(_suggestedName);

    const readable = new ReadableStream({
      pull: async (controller) => {
        try {
          const rows = await params.getNextPage(iterator++);

          if (!rows || !rows.length) {
            messaging.postMessage(
              JSON.stringify({
                type: "progress",
                payload: { total: 100, state: "success" },
              }),
            );

            await this.workerManager.triggerWorker({ id: iterator, type: "done" });

            messaging.close();
            controller.close();

            return;
          }

          const csvChunks = await this.workerManager.triggerWorker({
            id: iterator,
            type: "map_to_csv",
            data: rows,
            columns: params.columns,
          });

          console.log("triggerWorker::", { csvChunks });

          messaging.postMessage(
            JSON.stringify({
              type: "progress",
              payload: { total: 100, state: "pending" },
            }),
          );

          controller.enqueue(encoder.encode(csvChunks as string));
        } catch (error) {
          controller.error(error);

          messaging.postMessage(
            JSON.stringify({
              type: "progress",
              payload: { total: 100, state: "failed" },
            }),
          );
        }
      },
    });

    try {
      await readable.pipeTo(writableFileStream);
    } catch (err) {
      console.error("Export failed:", err);
      throw err;
    } finally {
      this.workerManager.terminate();
    }

    console.log("FsAccessExportStrategy::export(params)", { params });

    return {
      finished: true,
    };
  }
}

export default FsAccessExportStrategy;
