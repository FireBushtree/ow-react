import { useState } from 'react'
import { createRoot } from 'react-dom/client'

function App() {
  const [str, setStr] = useState('owen react')
  window.setStr = setStr

  return <div>
    {
      str === 1 ? <span>demo</span> : <span>{str}</span>
    }
  </div>
}

createRoot(document.getElementById('root')).render(<App />)
