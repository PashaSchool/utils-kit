import ExportControlFabric from "./ExportControlFabric";
import {ExportParams} from "./types";


const useExportCSV = (params: ExportParams) => {
  
  const handler = async () => {
    const controller = ExportControlFabric.create();
    
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
    cb({} as ListenerCallbackProps)
  }, []);
}

const {handler} = useExportCSV({
  fileName: 'test',
  getNextPage: async (offset) => ['1', '2'],
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
