import type { WorkerMessage, WorkerResponse } from "./types";
import { objectsToCSV } from "./utils";

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const { id, type, columns, data } = event.data;

  try {
    if (type === "process") {
      const csvChunk = objectsToCSV(data);
      self.postMessage({ id, result: csvChunk } as WorkerResponse);
    }
  } catch (error) {
    const _error = error instanceof Error ? error : new Error(String(error));

    self.postMessage({
      id,
      error: _error,
    } as WorkerResponse);
  }
};
