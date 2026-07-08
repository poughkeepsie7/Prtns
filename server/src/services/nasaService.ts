import axios from 'axios';
import { Pool } from 'pg';
import Redis from 'ioredis';

const NASA_BASE_URL = 'https://api.nasa.gov/neo/rest/v1';
const CACHE_TTL = 60 * 60 * 6; // 6 hours

export async function fetchAndStoreAsteroids(pool: Pool, redis: Redis) {
  const today = new Date();
  const startDate = today.toISOString().split('T')[0];
  const endDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const cacheKey = `neows:${startDate}`;

  // Check Redis cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    console.log('Returning cached NeoWs data');
    return JSON.parse(cached);
  }

  // Fetch from NASA
  const response = await axios.get(`${NASA_BASE_URL}/feed`, {
    params: {
      start_date: startDate,
      end_date: endDate,
      api_key: process.env.NASA_API_KEY,
    },
  });

  const data = response.data;
  const asteroids = Object.values(data.near_earth_objects).flat() as any[];

  // Store in PostgreSQL
  for (const asteroid of asteroids) {
    const { rows } = await pool.query(
      `INSERT INTO asteroids (nasa_id, name, diameter_km, is_potentially_hazardous)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (nasa_id) DO UPDATE
       SET name = EXCLUDED.name,
           diameter_km = EXCLUDED.diameter_km,
           is_potentially_hazardous = EXCLUDED.is_potentially_hazardous,
           updated_at = CURRENT_TIMESTAMP
       RETURNING id`,
      [
        asteroid.id,
        asteroid.name,
        asteroid.estimated_diameter.kilometers.estimated_diameter_max,
        asteroid.is_potentially_hazardous_asteroid,
      ]
    );

    const asteroidId = rows[0].id;

    for (const approach of asteroid.close_approach_data) {
      await pool.query(
        `INSERT INTO close_approaches (asteroid_id, approach_date, miss_distance_km, relative_velocity_km_s)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT DO NOTHING`,
        [
          asteroidId,
          approach.close_approach_date,
          parseFloat(approach.miss_distance.kilometers),
          parseFloat(approach.relative_velocity.kilometers_per_second),
        ]
      );
    }
  }

  // Cache the raw response
  await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(data));
  console.log(`Stored ${asteroids.length} asteroids for ${today}`);
  return data;
}