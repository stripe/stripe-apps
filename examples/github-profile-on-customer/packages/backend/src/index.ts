import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { readFileSync } from 'fs';
import { createServer } from 'https';
import 'source-map-support/register';

import { authRouter } from './routes/auth';
import { githubRouter } from './routes/github';

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth', authRouter);
app.use('/github', githubRouter);

createServer(
  {
    key: readFileSync('server.key'),
    cert: readFileSync('server.cert'),
  },
  app,
).listen(8080, () => console.log('Server started'));
