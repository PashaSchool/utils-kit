import { WEB_WORKER_NAME } from "./contants";

class WorkerManager {
  private worker: Worker | null = null;

  constructor() {
    this.initialiseWorker();
  }

  initialiseWorker() {
    let workerUrl: string | URL;

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

  terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}

export default WorkerManager;
