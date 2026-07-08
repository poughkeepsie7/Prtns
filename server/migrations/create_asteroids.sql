CREATE TABLE IF NOT EXISTS asteroids (
  id SERIAL PRIMARY KEY,
  nasa_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  diameter_km FLOAT,
  is_potentially_hazardous BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_asteroids_nasa_id ON asteroids(nasa_id);