import { BROADCAST_CHANNEL_NAME } from "../contants";
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
          totalRowsLoaded = isRowsEmpty ? safeTotal : (totalRowsLoaded += safeRows.length);
          const isFinished = totalRowsLoaded >= safeTotal;

          if (isRowsEmpty) {
            messaging.postMessage(
              JSON.stringify({
                type: "done",
                total: safeTotal,
                loadedItemsCount: totalRowsLoaded,
              }),
            );

            await this.workerManager.triggerWorker({ id: iterator, type: "completed" });

            messaging.close();
            controller.close();

            return;
          }

          const csvChunks = await this.workerManager.triggerWorker({
            id: iterator,
            type: "to_csv_chunk",
            data: safeRows,
            columns: params.columns,
          });

          messaging.postMessage(
            JSON.stringify({
              type: "progress",
              total: safeTotal,
              loadedItemsCount: totalRowsLoaded,
            }),
          );

          controller.enqueue(encoder.encode(csvChunks as string));

          if (isFinished) {
            messaging.postMessage(
              JSON.stringify({
                type: "done",
                total: safeTotal,
                loadedItemsCount: totalRowsLoaded,
              }),
            );

            await this.workerManager.triggerWorker({ id: iterator, type: "completed" });

            messaging.close();
            controller.close();

            return;
          }
        } catch (error) {
          controller.error(error);

          messaging.postMessage(
            JSON.stringify({
              type: "failed",
              total: 0,
              loadedItemsCount: totalRowsLoaded,
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
      logs: {
        warnings: [],
      },
    };
  }
}

export default FsAccessExportStrategy;
