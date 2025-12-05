import {ExportParams, ExportStrategy} from "./types";
import {WEB_WORKER_NAME} from "./constnats";


const workerUrl = new URL('./worker.js', '')
const worker = new Worker(workerUrl, {type: 'module', name: WEB_WORKER_NAME})

const pending = new Map<string, { resolve: (value: unknown) => void, reject: (reason?: any) => void }>()

worker.onmessage((event) => {
  const {id, result, error} = event.data
  const entity = pending.get(id);
  
  if (!entity) {
    return
  }
  
  pending.delete(id);
  
  if (error) {
    entity.reject(error)
  } else {
    entity.resolve(result)
  }
})


class FsAccessExportStrategy implements ExportStrategy {
  async export(params: ExportParams): Promise<any> {
    const _suggestedName = params?.fileName || 'export';
    
    const fileHandle = await window.showSaveFilePicker({
      suggestedName: _suggestedName,
      types: [{description: 'CSV file', accept: {'text/csv': ['.csv']}}],
    })
    
    const fileStram = await fileHandle.createWritable()
    let iterator = 0;
    
    const encoder = new TextEncoder()
    const messaging = new BroadcastChannel(_suggestedName)
    
    const workerUrl = new URL('./worker.js', '')
    const worker = new Worker(workerUrl, {type: 'module', name: WEB_WORKER_NAME})
    
    const readable = new ReadableStream({
      async pull(controller) {
        const rows = await params.getNextPage(iterator++)
        
        if (!rows || !rows.length) {
          controller.close();
          messaging.close();
          worker.terminate();
          
          return;
        }
        
        const csvChunks = rows.map(row => row).join('') // TODO: Worker handler
        // TODO: Messaging
        
        const _postMessagePayload = {
          type: "progress",
          payload: {total: 100}
        }
        messaging.postMessage(JSON.stringify(_postMessagePayload));
        worker.postMessage('Ping')
        
        controller.enqueue(encoder.encode(csvChunks))
      }
    })
    
    worker.addEventListener("message", async message => {
      console.log("Received message", message)
    })
    
    await readable.pipeTo(fileStram)
    
    console.log('FsAccessExportStrategy::export(params)', {params});
  }
}

export default FsAccessExportStrategy;
