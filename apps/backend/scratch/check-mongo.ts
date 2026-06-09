import mongoose from 'mongoose';

async function checkMongo() {
  const MONGO_URI = 'mongodb://localhost:27017/Fintech';
  console.log(`Connecting to MongoDB at ${MONGO_URI}...`);
  
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB.');
    
    const db = mongoose.connection.db;
    if (!db) {
      console.log('No database connection.');
      return;
    }

    const collections = await db.listCollections().toArray();
    console.log('Collections found:', collections.map(c => c.name));
    
    for (const col of collections) {
      const count = await db.collection(col.name).countDocuments();
      console.log(`Collection "${col.name}" has ${count} documents.`);
    }
    
    await mongoose.disconnect();
  } catch (err: any) {
    console.error('Failed to connect to MongoDB or no data found:', err.message);
  }
}

checkMongo();
