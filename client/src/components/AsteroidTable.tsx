import { Asteroid } from '../types/asteroid'

interface Props {
  asteroids: Asteroid[]
}

const th: React.CSSProperties = {
  padding: '8px 12px',
  textAlign: 'left',
  color: '#aaa',
  fontWeight: 600,
}

const td: React.CSSProperties = {
  padding: '8px 12px',
  color: '#eee',
}

export function AsteroidTable({ asteroids }: Props) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #444' }}>
            <th style={th}>Name</th>
            <th style={th}>Date</th>
            <th style={th}>Miss Distance (km)</th>
            <th style={th}>Velocity (km/s)</th>
            <th style={th}>Diameter (km)</th>
            <th style={th}>Hazardous</th>
          </tr>
        </thead>
        <tbody>
          {asteroids.map((a) => (
            <tr key={a.id} style={{ borderBottom: '1px solid #222' }}>
              <td style={td}>{a.name}</td>
              <td style={td}>{new Date(a.approach_date).toLocaleDateString()}</td>
              <td style={td}>{a.miss_distance_km.toFixed(0)}</td>
              <td style={td}>{a.relative_velocity_km_s.toFixed(2)}</td>
              <td style={td}>{a.diameter_km.toFixed(4)}</td>
              <td style={{ ...td, color: a.is_potentially_hazardous ? 'red' : 'green' }}>
                {a.is_potentially_hazardous ? '⚠ YES' : 'NO'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}