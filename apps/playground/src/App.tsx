import {useState} from 'react'
import {useUrlParams, useBatchUrlParams} from 'react-url-query-params'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const { toggleHey } = useUrlParams({
    keyName: 'hey',
    options: ['one', 'two'] as const
  })
  
  const {set, isModalOpened, isModalClosed, isViewOne, isViewTwo} = useBatchUrlParams({
    view: ['one', 'two'],
    modal: ['opened', 'closed']
  })
 
  return (
    <>
      <div>
        <button type="button" onClick={() => {
          set({
            view: 'one',
            modal: 'opened'
          })
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
