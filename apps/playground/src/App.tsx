import {useEffect, useRef, useState} from 'react'
// import {useUrlParams, useBatchUrlParams} from 'react-url-query-params'
import {ExportController, ExportControllerSingleton} from 'export-csv-core'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


async function fetchData(nextIteration: number) {
  const searchParams = new URLSearchParams({
    _page: String(nextIteration),
    limit: '10'
  })
  
  if (nextIteration === 5) {
    throw new Error("Stop")
  }
  
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts?${searchParams.toString()}`)
  const data = await response.json()
  
  console.log({data})
  return data
  
}

const BENCHMARK = 'my_export'


function useExportCSV() {
  const exportCallbackRef = useRef<ExportController>(ExportControllerSingleton.init())
  
  return {
    handler: exportCallbackRef.current!
  }
}


type Payload = {
  payload: { total: number, state: "pending" | 'success' | 'failed' }
}

function useMessageExportCSV(cb: (payload: Payload) => void) {
  useEffect(() => {
    const channel = new BroadcastChannel(BENCHMARK);
    
    channel.addEventListener('message', (params) => {
      const json = JSON.parse(params.data)
      
      if (json.type === 'progress') {
        cb(json)
      }
    })
    
    return () => {
      channel.close();
    }
  }, [])
}


function App() {
  const [count, setCount] = useState(0)
  
  const {handler} = useExportCSV()
  
  useMessageExportCSV((payload) => {
    console.log("useMessageExportCSV::", {payload})
  })
  
  return (
    <>
      <div>
        <button type="button" onClick={async () => {
          const response = await handler.start({
            fileName: BENCHMARK,
            getNextPage: async (skipIterationNumber) => {
              const rows = await fetchData(skipIterationNumber);
              console.log("my_export", {skipIterationNumber, rows})
              
              return rows
            }
          })
          
          console.log("response::", {response})
        }}>
          <img src={viteLogo} className="logo" alt="Vite logo"/>
        </button>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo"/>
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
