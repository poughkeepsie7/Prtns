CREATE TABLE IF NOT EXISTS close_approaches (
  id SERIAL PRIMARY KEY,
  asteroid_id INT NOT NULL REFERENCES asteroids(id) ON DELETE CASCADE,
  approach_date DATE NOT NULL,
  miss_distance_km FLOAT NOT NULL,
  relative_velocity_km_s FLOAT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_close_approaches_asteroid_id ON close_approaches(asteroid_id);
CREATE INDEX idx_close_approaches_date ON close_approaches(approach_date);