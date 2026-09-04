import type { IncomingMessage, ServerResponse } from 'node:http';
import { createApp } from '../server/app.js';
import { connectDatabase } from '../server/lib/mongoose.js';

const app = createApp();

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  await connectDatabase();
  return app(req, res);
}
