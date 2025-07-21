import { useState } from 'react'
import { createRoot } from 'react-dom/client'

function App() {
  const [str, setStr] = useState(100)

  return (
    <div>
      <div
        onClick={() => {
          setStr(str + 1)
        }}
      >
        { str }
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')).render(<App />)
