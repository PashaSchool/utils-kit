import type { WorkerMessage, WorkerResponse } from "./types";
import { objectsToCSV } from "./utils";

let headersWritten = false;

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const { id, type, columns, data } = event.data;

  try {
    if (type === "process") {
      const csvChunk = objectsToCSV(data, columns, !headersWritten);

      headersWritten = true;

      self.postMessage({ id, result: csvChunk, type: "csvChunk" } as WorkerResponse);
    } else if (type === "complete") {
      headersWritten = false;
      self.postMessage({ type: "done" });
    }
  } catch (error) {
    const _error = error instanceof Error ? error : new Error(String(error));

    self.postMessage({
      id,
      error: _error,
      type: "error",
    } as WorkerResponse);
  }
};
