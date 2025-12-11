"use strict";

// src/worker.ts
self.onmessage = (event) => {
  const { id, type, columns, data } = event.data;
  try {
    if (type === "process") {
      const result = {};
      self.postMessage({ id, result });
    }
  } catch (error) {
    self.postMessage({
      id,
      error: error instanceof Error ? error : new Error(String(error)),
    });
  }
};
