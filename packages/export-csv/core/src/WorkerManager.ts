import { WEB_WORKER_NAME } from "./contants";

const pending = new Map<
  string,
  { resolve: (value: unknown) => void; reject: (reason?: any) => void }
>();

class WorkerManager {
  #worker: Worker | null;

  constructor() {
    let workerUrl: URL | string;

    try {
      workerUrl = new URL("./worker.js", import.meta.url);
    } catch {
      workerUrl = "/worker.js";
    }

    this.#worker = new Worker(workerUrl, {
      type: "module",
      name: WEB_WORKER_NAME,
    });
    
    this.#listenerRegistry();
  }

  static initialise() {
    return new WorkerManager();
  }
  
  #listenerRegistry() {
    this.#worker!.addEventListener('message', (event) => {
      const { id, result, error } = event.data;
      const entity = pending.get(id);
      
      if (!entity) {
        return;
      }
      
      pending.delete(id);
      
      if (error) {
        entity.reject(error);
      } else {
        entity.resolve(result);
      }
      
      console.log("#listenerRegistry",{event})
    })
  }
  
  async triggerWorker(payload: any) {
    const id = payload.id ?? Math.random().toString(36).substr(2);
    
    const p = new Promise((resolve, reject) => {
      pending.set(id, {resolve, reject});
    })
    
    this.#worker!.postMessage(payload);
    
    return p;
  }

  terminate() {
    if (this.#worker) {
      this.#worker.terminate();
      this.#worker = null;
    }
  }
}

export default WorkerManager;
