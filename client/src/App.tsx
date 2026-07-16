import { useAsteroids } from './hooks/useAsteroids'
import { AsteroidTable } from './components/AsteroidTable'

function App() {
  const { asteroids, loading, error } = useAsteroids()

  if (loading) return <div style={{ color: '#eee', padding: '2rem' }}>Loading asteroids...</div>
  if (error) return <div style={{ color: 'red', padding: '2rem' }}>Error: {error}</div>

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', padding: '2rem', color: '#eee' }}>
      <h1 style={{ color: '#fff', marginBottom: '0.5rem' }}>☄ Asteroid Threat Dashboard</h1>
      <p style={{ color: '#aaa', marginBottom: '2rem' }}>{asteroids.length} asteroids tracked this week</p>
      <AsteroidTable asteroids={asteroids} />
    </div>
  )
}

export default App