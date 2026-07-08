import cron from 'node-cron';
import { Pool } from 'pg';
import Redis from 'ioredis';
import { fetchAndStoreAsteroids } from '../services/nasaService';

export function startCronJobs(pool: Pool, redis: Redis) {
  // Runs every day at midnight UTC
  cron.schedule('0 0 * * 1', async () => {
    console.log('Cron: fetching asteroid data...');
    try {
      await fetchAndStoreAsteroids(pool, redis);
      console.log('Cron: asteroid fetch complete');
    } catch (error) {
      console.error('Cron: asteroid fetch failed:', error);
    }
  });

  console.log('Cron jobs started');
}