import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import Redis from 'ioredis';
import { runMigrations } from './db/migrations';
import { asteroidRouter } from './routes/asteroids';
import { startCronJobs } from './jobs/fetchAsteroids';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const redis = new Redis(process.env.REDIS_URL || 'redis://redis:6379');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/asteroids', asteroidRouter(pool, redis));

async function start() {
  console.log('Running migrations...');
  await runMigrations(pool);
  startCronJobs(pool, redis);
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start().catch(console.error);