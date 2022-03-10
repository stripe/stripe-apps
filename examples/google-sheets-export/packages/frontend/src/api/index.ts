import axios from 'axios';

import { baseURL } from '../config';

const instance = axios.create({
  baseURL,
});

instance.interceptors.response.use(
  config => config.data,
  error => Promise.reject(error),
);

export const request = instance;
