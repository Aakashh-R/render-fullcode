// index.js (or server.js) — ES module version
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import connectDB from './src/config/db.js';
import { verifyTransporter } from './src/utils/emailService.js';

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env manually from backend folder
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('MONGO_URI =', process.env.MONGO_URI);

const app = express();
app.use(cors());
app.use(express.json());

// Optional: basic health route available regardless of DB (useful for k8s/liveness)
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Centralized start function so we only attach routes after DB ready
async function start() {
  try {
    // 1) Connect to DB and wait for successful connection
    await connectDB(); // connectDB should return a promise that resolves once mongoose.connect() completes
    console.log('Database connection established — continuing startup');

    // 2) Optionally verify mail transporter after DB connected (so it can use config from DB/env)
    verifyTransporter()
      .then(() => console.log('Email transporter verified'))
      .catch(err =>
        console.warn(
          'Email transporter verification error (startup)',
          err && err.message ? err.message : err
        )
      );

    // 3) Dynamically import routes after DB connected to avoid queries at module import time
    const { default: authRoutes } = await import('./src/routes/authRoutes.js');
    const { default: dataRoutes } = await import('./src/routes/dataRoutes.js');
    const { default: templateRoutes } = await import('./src/routes/templateRoutes.js');
    const { default: sendRoutes } = await import('./src/routes/sendRoutes.js');

    // 4) Mount routes
    app.use('/api/auth', authRoutes);
    app.use('/api/data', dataRoutes);
    app.use('/api/templates', templateRoutes);
    // changed to /api/send to avoid duplicate mount path — change if you meant something else
    app.use('/api/send', sendRoutes);

    // 5) start listening
    const PORT = process.env.PORT || 5001;
    const server = app.listen(PORT, () => console.log(`Server running on ${PORT}`));

    // optional: handle graceful shutdown
    const shutdown = async signal => {
      console.log(`Received ${signal}. Closing server and DB connection...`);
      server.close(() => console.log('HTTP server closed'));
      // if your connectDB exports a mongoose instance or you can import mongoose here:
      try {
        const mongoose = (await import('mongoose')).default;
        await mongoose.connection.close(false);
        console.log('MongoDB connection closed');
      } catch (err) {
        console.error('Error closing MongoDB connection', err);
      }
      process.exit(0);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (err) {
    console.error('Startup error:', err);
    process.exit(1);
  }
}

start();
