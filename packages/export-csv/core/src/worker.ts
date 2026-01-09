import { objectsToCSV } from "./utils";

export type JobId = string & { readonly __brand: unique symbol };

type ToCSVChunkMessage = {
  id: JobId;
  type: "to_csv_chunk";
  columns: ReadonlyArray<{ key: string; label: string }>;
  data: ReadonlyArray<Record<string, unknown>>;
};

type ToCompleteMessage = {
  id: JobId;
  type: "completed";
};

type ToWorkerMessage = ToCSVChunkMessage | ToCompleteMessage;

type FromWorkerChunkMessage = {
  id: JobId;
  result: string;
  type: "csv_chunk";
};

type FromWorkerDoneMessage = {
  id: JobId;
  type: "done";
};

type ErrorPayload = {
  name: string;
  message: string;
  stuck: string;
};
type FromWorkerFailureMessage = {
  id: JobId;
  type: "error";
  error: ErrorPayload;
};

type FromWorkerMessage = FromWorkerDoneMessage | FromWorkerFailureMessage | FromWorkerChunkMessage;

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
      id: msg.id,
      error: _error,
      type: "error",
    });
  }
};
