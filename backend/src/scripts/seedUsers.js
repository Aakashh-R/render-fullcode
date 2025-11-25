#!/usr/bin/env node
// Simple seed script to create demo users for various roles.
import dotenv from 'dotenv';
dotenv.config({ path: new URL('../../.env', import.meta.url) });
import mongoose from 'mongoose';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { COMPANIES_ROLES } from '../config/roles.js';

// Usage:
//   node src/scripts/seedUsers.js [count]
// or set env var COUNT_PER_ROLE
const COUNT = parseInt(process.argv[2] || process.env.COUNT_PER_ROLE || '1', 10);

async function main() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI not set in .env');
    process.exit(1);
  }
  await mongoose.connect(uri);
  console.log('Connected to MongoDB for seeding');

  for (const c of COMPANIES_ROLES) {
    for (const r of c.roles) {
      for (let i = 1; i <= COUNT; i++) {
        const localId = COUNT > 1 ? `_${i}` : '';
        const email = `demo+${c.name.replace(/\s+/g, '').toLowerCase()}_${r.replace(/\s+/g,'').toLowerCase()}${localId}@example.com`;
        const exists = await User.findOne({ email });
        if (exists) {
          console.log('Skipping existing', email);
          continue;
        }
        const hashed = await bcrypt.hash('DemoPass123', 10);
        await User.create({ name: `Demo ${r} ${i}`, email, password: hashed, companyName: c.name, role: r });
        console.log('Created', email, c.name, r);
      }
    }
  }

  console.log('Seeding complete');
  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
