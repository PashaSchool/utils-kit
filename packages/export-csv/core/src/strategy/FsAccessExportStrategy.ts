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

    const fileStram = await fileHandle.createWritable();
    let iterator = 0;

    const encoder = new TextEncoder();
    const messaging = new BroadcastChannel(_suggestedName);

    const readable = new ReadableStream({
      pull: async (controller) => {
        try {
          const rows = await params.getNextPage(iterator++);

          if (!rows || !rows.length) {
            controller.close();

            messaging.postMessage(
              JSON.stringify({
                type: "progress",
                payload: { total: 100, state: "success" },
              }),
            );

            messaging.close();

            return;
          }

          const response = await this.workerManager.triggerWorker({
            id: iterator,
            type: "process",
            data: rows,
            columns: [
              {key: 'id', label: 'ID'},
              {key: 'title', label: 'Title'},
              {key: 'body', label: 'Content'},
              {key: 'userId', label: 'USER ID'},
            ]
          });

          console.log("triggerWorker::", { response });

          messaging.postMessage(
            JSON.stringify({
              type: "progress",
              payload: { total: 100, state: "pending" },
            }),
          );

          controller.enqueue(encoder.encode(response as string));
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

    const writable = new WritableStream({
      write(chunk) {
        // chunk can be Uint8Array or string depending on your readable
        return fileStram.write(chunk);
      },
      close() {
        return fileStram.close();
      },
      abort(reason) {
        return fileStram.abort(reason);
      },
    });

    await readable.pipeTo(writable).finally(() => this.workerManager.terminate());

    console.log("FsAccessExportStrategy::export(params)", { params });

    return {
      finished: true,
    };
  }
}

export default FsAccessExportStrategy;
