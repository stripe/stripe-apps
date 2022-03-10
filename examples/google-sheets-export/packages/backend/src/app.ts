import cors from 'cors';
import express from 'express';

import { loggedIn, login, logout, sheets, userInfo, verify } from './routes';
import { TokenSet } from './types';
import { verifyCaller } from './utils/verifyCaller';

// These will be replaced with an actual persistent state store like Redis or a RDBMS.
const tokenStore = new Map<string, TokenSet>();
const authStore = new Map<string, string>();

const app = express();
const router = express.Router();

app.use(cors());
app.use(express.json());
app.set('view engine', 'ejs');

router.get('/auth/login', login);

router.get('/auth/callback/logged-in', (req, res) =>
  loggedIn(req, res, authStore),
);

router.delete('/auth/session', verifyCaller, (req, res) => {
  logout(req, res, tokenStore);
});

router.get('/auth/verify', verifyCaller, (req, res) => {
  verify(req, res, authStore, tokenStore);
});

router.get('/auth/userinfo', verifyCaller, (req, res) => {
  userInfo(req, res, tokenStore);
});

router.post('/sheets', verifyCaller, (req, res) =>
  sheets({ req, res, tokenStore }),
);

app.use('/api', router);

export default app;
