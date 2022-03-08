/* WARNING! API token-based APIs cannot be safely used from UI Extensions. This example is
 * ok because it's a test token and not sensitive, but if this were to be productionized
 * we'd have to modify this code to be secure. There are two options:
 * - If we control the backend, we can use [Stripe-provided signed payloads](https://stripe.com/docs/stripe-apps/build-backend#authenticate-ui-to-backend)
 *   to verify the origin of the request.
 * - If we do not control the backend (as is the case in this example), we would need to either
 *   authenticate the user with Shippo using OAuth or write our own backend that communicates
 *   with the Shippo API using an API token and the signature verification referenced above.
 */
const SHIPPO_TOKEN =
  'ShippoToken shippo_test_ccc7f1c4ed9ef8beaa43c07b2941e2260f40fd72';

export const request = (endpoint: string, method: 'GET' | 'POST', requestData: string) => {
  return fetch(`https://api.goshippo.com/${endpoint}`, {
    method,
    headers: {
      Authorization: SHIPPO_TOKEN,
      'Content-Type': 'application/json',
    },
    body: requestData,
  });
};
