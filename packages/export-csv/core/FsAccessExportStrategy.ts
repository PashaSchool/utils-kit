import {ExportParams, ExportStrategy} from "./types";

class FsAccessExportStrategy implements ExportStrategy {
  async export(params: ExportParams): Promise<any> {
    const _suggestedName = params?.fileName || 'export';
    
    const fileHandle = await window.showSaveFilePicker({
      suggestedName: _suggestedName,
      types: [{ description: 'CSV file', accept: { 'text/csv': ['.csv'] } }],
    })
    
    const fileStram = await fileHandle.createWritable()
    const encoder = new TextEncoder()
    let iterator = 0;
    
    const readable = new ReadableStream({
      async pull(controller) {
        const rows = await params.getNextPage(iterator++)
        
        if(!rows || !rows.length) {
          controller.close();
          return;
        }
        
        const csvChunks = rows.map(row => row).join('') // TODO: Worker handler
        controller.enqueue(encoder.encode(csvChunks))
      }
    })
    
    await readable.pipeTo(fileStram)
    
    console.log('FsAccessExportStrategy::export(params)', {params});
  }
}

export default FsAccessExportStrategy;
