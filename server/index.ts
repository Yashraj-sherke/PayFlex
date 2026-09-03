import 'dotenv/config';
import { createApp } from './app.js';
import { connectDatabase, disconnectDatabase } from './lib/mongoose.js';

const port = Number(process.env.PORT ?? 4000);

async function start() {
  await connectDatabase();

  const app = createApp();

  const server = app.listen(port, () => {
    console.info(`PayFlex API listening on http://localhost:${port}`);
  });

  async function shutdown(signal: string) {
    console.info(`${signal} received. Closing PayFlex API.`);
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  }

  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
}

start().catch((error) => {
  console.error('Failed to start PayFlex API.', error);
  process.exit(1);
});
