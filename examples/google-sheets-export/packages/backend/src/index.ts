import { readFileSync } from 'fs';
import { createServer } from 'https';

import app from './app';
import { port } from './config';

createServer(
  {
    key: readFileSync(`${__dirname}/server.key`),
    cert: readFileSync(`${__dirname}/server.cert`),
  },
  app,
).listen(port, () => console.log('Server started'));
