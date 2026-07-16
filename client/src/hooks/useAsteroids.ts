import { useState, useEffect } from 'react';
import { Asteroid } from '../types/asteroid';

export function useAsteroids() {
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/asteroids')
      .then(res => res.json())
      .then(data => {
        setAsteroids(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { asteroids, loading, error };
}