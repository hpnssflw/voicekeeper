/**
 * Скрипт для очистки всех коллекций в MongoDB
 * Использование: npx tsx scripts/clear-db.ts
 */

// Загружаем переменные окружения из .env.local
import { config } from 'dotenv';
import { resolve } from 'path';

// Загружаем .env.local файл
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { connectMongo, disconnectMongo } from '../lib/db/mongo';

async function clearDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await connectMongo();
    
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }
    
    console.log('Getting all collections...');
    const collections = await db.listCollections().toArray();
    
    console.log(`Found ${collections.length} collections:`);
    collections.forEach(col => console.log(`  - ${col.name}`));
    
    console.log('\nClearing all collections...');
    for (const collection of collections) {
      const result = await db.collection(collection.name).deleteMany({});
      console.log(`  ✓ Cleared ${collection.name}: ${result.deletedCount} documents`);
    }
    
    console.log('\n✅ Database cleared successfully!');
    
    await disconnectMongo();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    process.exit(1);
  }
}

clearDatabase();

