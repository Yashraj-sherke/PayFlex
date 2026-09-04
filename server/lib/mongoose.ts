import mongoose from 'mongoose';

const uri = process.env.DATABASE_URL ?? 'mongodb://localhost:27017/payflex';

export async function connectDatabase(): Promise<void> {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  await mongoose.connect(uri);
  console.info('Connected to MongoDB.');
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
}
