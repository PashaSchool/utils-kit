import { WEB_WORKER_NAME } from "./contants";

class WorkerManager {
  private worker: Worker | null;

  constructor() {
    let workerUrl: URL | string;

    try {
      workerUrl = new URL("./worker.js", import.meta.url);
    } catch {
      workerUrl = "/worker.js";
    }

    this.worker = new Worker(workerUrl, {
      type: "module",
      name: WEB_WORKER_NAME,
    });
  }

  static initialise() {
    return new WorkerManager();
  }

  terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}

export default WorkerManager;
