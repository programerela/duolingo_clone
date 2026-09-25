import { app } from './app';
import { pool } from './config/db';
import { env } from './config/env';

async function start() {
  try {
    await pool.query('SELECT 1');
    console.log('PostgreSQL connected');

    app.listen(env.PORT, () => {
      console.log(`Duolingo Clone API running on http://localhost:${env.PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
