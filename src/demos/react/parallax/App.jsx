import { useState, useEffect } from 'react'
import Layers from './Layers'

export default function App() {
  const [y, setY] = useState(0)

  useEffect(() => {
    const onScroll = () => setY(window.scrollY)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{ height: '220vh', background: '#0d0d17', color: '#eee' }}>
      <Layers y={y} />
      <h1
        style={{
          position: 'relative',
          paddingTop: '40vh',
          textAlign: 'center',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        Scroll me
      </h1>
    </div>
  )
}
