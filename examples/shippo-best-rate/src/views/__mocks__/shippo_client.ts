import invariant from "ts-invariant";
import {shippoTransaction, shippoShipment} from './mock_objects';

type Method = 'GET' | 'POST';

const fakeResponse = (body: object) => ({
  ok: true,
  json: () => Promise.resolve(body),
});

const mockAPI: {[endpoint: string]: (method: Method, requestData: string) => any} = {
  'transactions': (method, _) => {
    invariant(method === 'POST', 'GET is not mocked for transactions endpoint');
    return fakeResponse(shippoTransaction);
  },
  'shipments': (method, _) => {
    invariant(method === 'POST', 'GET is not mocked for transactions endpoint');
    return fakeResponse(shippoShipment);
  },
}

export const request = jest.fn((endpoint: string, method: Method, requestData: string) => {
  const impl = mockAPI[endpoint];
  invariant(impl, `Made request to unmocked endpoint ${endpoint}`);
  return Promise.resolve(impl(method, requestData))
});