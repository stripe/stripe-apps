import axios from 'axios';
import { Request, Response, Router } from 'express';
import { request } from 'graphql-request';
import { Stream } from 'stream';

import { githubAPIURI } from '../config';
import { query as searchQuery } from '../queries/search';
import { query as userQuery } from '../queries/user';
import { useToken, verifyCaller } from './auth';

const USER_URI = `${githubAPIURI}/user`;
const GRAPHQL_URI = `${githubAPIURI}/graphql`;

export const githubRouter = Router();

githubRouter.get(
  '/user',
  [verifyCaller, useToken],
  async (req: Request, res: Response) => {
    const response = await axios.get<Stream>(USER_URI, {
      responseType: 'stream',
      headers: {
        authorization: `${res.locals.githubToken.token_type} ${res.locals.githubToken.access_token}`,
      },
    });
    res.status(response.status);
    response.data.pipe(res);
  },
);

githubRouter.get(
  '/search',
  [verifyCaller, useToken],
  async (req: Request, res: Response) => {
    console.log(req.query);
    const response = await request({
      url: GRAPHQL_URI,
      document: searchQuery,
      variables: {
        ...req.query,
        first: +req.query.first || undefined,
        last: +req.query.last || undefined,
      },
      requestHeaders: {
        authorization: `${res.locals.githubToken.token_type} ${res.locals.githubToken.access_token}`,
      },
    });
    console.log(JSON.stringify(response));
    res.send(response);
  },
);

githubRouter.get(
  '/profile',
  [verifyCaller, useToken],
  async (req: Request, res: Response) => {
    console.log(req.query);
    const response = await request({
      url: GRAPHQL_URI,
      document: userQuery,
      variables: {
        ...req.query,
      },
      requestHeaders: {
        authorization: `${res.locals.githubToken.token_type} ${res.locals.githubToken.access_token}`,
      },
    });
    console.log(JSON.stringify(response));
    res.send(response);
  },
);
