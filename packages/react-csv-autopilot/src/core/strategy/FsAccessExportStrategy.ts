import { BROADCAST_CHANNEL_NAME } from "../contants";
import type { ExportParams, ExportResponse, ExportStrategy } from "../types";
import WorkerManager from "../WorkerManager";

class FsAccessExportStrategy implements ExportStrategy {
  private workerManager: WorkerManager;

  constructor() {
    this.workerManager = WorkerManager.initialise();
  }

  async export<T>(params: ExportParams<T>): Promise<ExportResponse> {
    const _suggestedName = params?.fileName || "export";

    const fileHandle = await window.showSaveFilePicker({
      suggestedName: _suggestedName,
      types: [{ accept: { "text/csv": [".csv"] }, description: "CSV file" }],
    });

    const writableFileStream = await fileHandle.createWritable();
    let iterator = 0;
    let totalRowsLoaded = 0;

    const encoder = new TextEncoder();
    const messaging = new BroadcastChannel(BROADCAST_CHANNEL_NAME);

    const readable = new ReadableStream({
      pull: async (controller) => {
        try {
          const response = await params.getNextPage(iterator++);

          const safeRows = Array.isArray(response.rows) ? response?.rows : [];
          const safeTotal = response.total ?? 0;

          const isRowsEmpty = !safeRows || !safeRows.length;
          const nextRowsLoaded = totalRowsLoaded + safeRows.length;
          totalRowsLoaded = isRowsEmpty ? safeTotal : nextRowsLoaded;
          const isFinished = totalRowsLoaded >= safeTotal;

          if (isRowsEmpty) {
            messaging.postMessage(
              JSON.stringify({
                loadedItemsCount: totalRowsLoaded,
                total: safeTotal,
                type: "done",
              }),
            );

            await this.workerManager.triggerWorker({
              id: iterator,
              type: "completed",
            });

            messaging.close();
            controller.close();

            return;
          }

          const csvChunks = await this.workerManager.triggerWorker({
            columns: params.columns,
            data: safeRows,
            id: iterator,
            type: "to_csv_chunk",
          });

          messaging.postMessage(
            JSON.stringify({
              loadedItemsCount: totalRowsLoaded,
              total: safeTotal,
              type: "progress",
            }),
          );

          controller.enqueue(encoder.encode(csvChunks as string));

          if (isFinished) {
            messaging.postMessage(
              JSON.stringify({
                loadedItemsCount: totalRowsLoaded,
                total: safeTotal,
                type: "done",
              }),
            );

            await this.workerManager.triggerWorker({
              id: iterator,
              type: "completed",
            });

            messaging.close();
            controller.close();

            return;
          }
        } catch (error) {
          controller.error(error);

          messaging.postMessage(
            JSON.stringify({
              loadedItemsCount: totalRowsLoaded,
              total: 0,
              type: "failed",
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

    return {
      finished: true,
      totalRowsLoaded,
    };
  }
}

export default FsAccessExportStrategy;
