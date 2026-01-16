import type { FromWorkerMessage, JobId, ToWorkerMessage } from "./types";
import { objectsToCSV } from "./utils";

const headersWritten = new Map<JobId, boolean>();

self.onmessage = (event: MessageEvent<ToWorkerMessage>) => {
  const msg = event.data;
  try {
    switch (msg.type) {
      case "to_csv_chunk": {
        const { columns, data, id } = msg;
        const csvChunk = objectsToCSV(data, columns, !headersWritten.get(id));
        const out: FromWorkerMessage = {
          id,
          result: csvChunk,
          type: "csv_chunk",
        };

        headersWritten.set(id, true);

        self.postMessage(out);

        break;
      }

      case "completed": {
        const out: FromWorkerMessage = { id: msg.id, type: "done" };
        self.postMessage(out);

        break;
      }

      default: {
        console.warn(`Unsupported for worker message:: ${JSON.stringify(msg)}`);
        break;
      }
    }
  } catch (error) {
    const _error = error instanceof Error ? error : new Error(String(error));

    self.postMessage({
      error: _error,
      id: msg.id,
      type: "error",
    });
  }
};
