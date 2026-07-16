import { Router } from 'express';
import { Pool } from 'pg';
import Redis from 'ioredis';
import { fetchAndStoreAsteroids } from '../services/nasaService';

export function asteroidRouter(pool: Pool, redis: Redis) {
  const router = Router();

  // Trigger fetch + return today's asteroids
  router.get('/', async (req, res) => {
    try {
      // Check if we already have data
      const { rows: existing } = await pool.query(
        `SELECT COUNT(*) FROM close_approaches`
      );

      // Only fetch from NASA if DB is empty
      if (parseInt(existing[0].count) === 0) {
        await fetchAndStoreAsteroids(pool, redis);
      }

      const { rows } = await pool.query(`
        SELECT 
          a.id, a.nasa_id, a.name, a.diameter_km, a.is_potentially_hazardous,
          c.approach_date, c.miss_distance_km, c.relative_velocity_km_s
        FROM asteroids a
        JOIN close_approaches c ON c.asteroid_id = a.id
        ORDER BY c.approach_date ASC
        LIMIT 100
      `);

      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch asteroids' });
    }
  });

  return router;
}