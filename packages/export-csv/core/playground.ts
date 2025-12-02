import ExportControlFabric from "./ExportControlFabric";
import {ExportParams} from "./types";


const useExportCSV = (params: ExportParams) => {
  
  const handler = async () => {
    const uuid = Math.random().toString(36).substr(2);
    
    const controller = ExportControlFabric.create(params);
    
    await controller.start(params)
  }
  
  return {
    handler,
  }
}

type ListenerCallbackProps = {
  isDone: boolean,
  isProcessing: boolean,
  isFailed: boolean,
  errorMessage: '',
  totalInPercent: number
}

const useExportCSVMessaging = (cb: (props: ListenerCallbackProps) => void) => {
  
  useEffect(() => {
    listen()
  }, []);
  
  return {
    listen() {
      
      return {
        isDone: false,
        isProcessing: true,
        isFailed: true,
        errorMessage: '',
        totalInPercent: 89,
      }
    }
  }
}

const {handler} = useExportCSV({
  fileName: 'test',
  getNextPage: async (offset) => ['1', '2']
})

useExportCSVMessaging((props: {
  isDone: boolean,
  isProcessing: boolean,
  isFailed: boolean,
  errorMessage: '',
  totalInPercent: number
}) => {
  console.log({props})
})
