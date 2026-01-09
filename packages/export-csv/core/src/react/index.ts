// import { useEffect, useRef } from 'react'
// import { ExportController, ExportControllerSingleton } from '../index'
// import { BROADCAST_CHANNEL_NAME } from '@/views/NDR/PortflowPage/src/contants'
//
// export function useExportCSV() {
//   const exportCallbackRef = useRef<ExportController>(ExportControllerSingleton.init())
//
//   return {
//     handler: exportCallbackRef.current!,
//   }
// }
//
// type Payload = { total: number; loadedItemsCount: number; state: 'progress' | 'failed' | 'done' }
//
// export function useMessageExportCSV(cb: (payload: Payload) => void) {
//   useEffect(() => {
//     const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME)
//
//     channel.addEventListener('message', (params: MessageEvent) => {
//       try {
//         const json = JSON.parse(params.data) as Payload
//
//         cb(json)
//       } catch (error) {
//         console.error({ error })
//       }
//     })
//
//     return () => {
//       channel.close()
//     }
//   }, [])
// }
