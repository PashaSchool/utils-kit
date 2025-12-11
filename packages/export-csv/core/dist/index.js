// src/controllers/ExportController.ts
var ExportController = class {
  constructor(deps) {
    this.deps = deps;
  }
  async start(params) {
    console.log("ExportController::start()");
    const strategy = this._resolveStrategy();
    return strategy.export(params);
  }
  _canUseFSAccess() {
    return typeof window.showSaveFilePicker === "function";
  }
  _resolveStrategy() {
    if (this._canUseFSAccess()) {
      return this.deps.fsAccessStrategy;
    }
    return this.deps.blobExportStrategy;
  }
};

// src/strategy/BolbExportStrategy.ts
var BolbExportStrategy = class {
  export(params) {
    return Promise.resolve({});
  }
};
var BolbExportStrategy_default = BolbExportStrategy;

// src/contants/index.ts
var WEB_WORKER_NAME = "scv-worker";

// src/WorkerManager.ts
var WorkerManager = class {
  constructor() {
    this.worker = null;
    this.initialiseWorker();
  }
  initialiseWorker() {
    let workerUrl;
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
};
var WorkerManager_default = WorkerManager;

// src/strategy/FsAccessExportStrategy.ts
var FsAccessExportStrategy = class {
  constructor() {
    this.workerManager = new WorkerManager_default();
  }
  async export(params) {
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
        const rows = await params.getNextPage(iterator++);
        if (!rows || !rows.length) {
          controller.close();
          messaging.close();
          this.workerManager.terminate();
          return;
        }
        const csvChunks = rows.map((row) => row).join("");
        const _postMessagePayload = {
          type: "progress",
          payload: { total: 100 },
        };
        messaging.postMessage(JSON.stringify(_postMessagePayload));
        controller.enqueue(encoder.encode(csvChunks));
      },
    });
    await readable.pipeTo(fileStram);
    console.log("FsAccessExportStrategy::export(params)", { params });
  }
};
var FsAccessExportStrategy_default = FsAccessExportStrategy;

// src/fabric/ExportControlFabric.ts
var ExportControlFabric = class {
  static create() {
    const controller = new ExportController({
      fsAccessStrategy: new FsAccessExportStrategy_default(),
      blobExportStrategy: new BolbExportStrategy_default(),
    });
    return controller;
  }
};

// src/ExportControllerSingleton.ts
var _ExportControllerSingleton = class _ExportControllerSingleton {
  static init() {
    if (_ExportControllerSingleton.instance) {
      return _ExportControllerSingleton.instance;
    }
    _ExportControllerSingleton.instance = ExportControlFabric.create();
    _ExportControllerSingleton.initialized = true;
    return _ExportControllerSingleton.instance;
  }
  static getInstance() {
    if (!_ExportControllerSingleton.instance) {
      return _ExportControllerSingleton.init();
    }
    return _ExportControllerSingleton.instance;
  }
};
_ExportControllerSingleton.instance = null;
_ExportControllerSingleton.initialized = false;
var ExportControllerSingleton = _ExportControllerSingleton;
var ExportControllerSingleton_default = ExportControllerSingleton;
export {
  ExportControlFabric,
  ExportController,
  ExportControllerSingleton_default as ExportControllerSingleton,
};
