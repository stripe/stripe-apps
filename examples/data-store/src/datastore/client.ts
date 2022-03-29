
import Stripe from "stripe";
import { createHttpClient, STRIPE_API_KEY } from '@stripe/ui-extension-sdk/http_client';

export class DataStore {
    private readonly _client: Stripe = new Stripe(STRIPE_API_KEY, {
        httpClient: createHttpClient() as Stripe.HttpClient,
        apiVersion: '2020-08-27',
    });
    private _userId: string;
    public constructor(userId: string) {
        this._userId = userId
    }

    /**
     * [Optional] Update the user ID
     */
    public updateUserId(userId: string) {
        this._userId = userId
    }

    /**
     * Create API path to call the data store API
     */
    private _getAPIPath(method: 'GET' | 'POST', secretName: string) {
        const queryStrings = [
            'scope[type]=user',
            `scope[user]=${this._userId}`,
            `name=${secretName}`,
        ];
        if (method === 'GET') queryStrings.push('expand[]=payload');
        const queryString = queryStrings.join('&');
        if (method === 'GET') {
            return `apps/secrets/find?${queryString}`;
        }
        return `apps/secrets?${queryString}`;
    }

    /**
     * Creating resource instance using Stripe SDK
     */
    private _createSecretResource(method: 'GET' | 'POST', secretName: string,) {
        const resource = Stripe.StripeResource.extend({
            request: Stripe.StripeResource.method({
                method,
                path: this._getAPIPath(method, secretName),
            }),
        });
        return resource;
    }

    
    /**
     * Call the secret store API
     */
    public async getSecret(secretName: string): Promise<string | null> {
        const getSecretResource = this._createSecretResource('GET', secretName);
        
        return new Promise((resolve, reject) => {
            new getSecretResource(this._client).request({}, function(err: Stripe.StripeRawError, secret: {
                payload: string | null;
            }) {
                if (err) {
                    if (err.code === 'resource_missing') {
                        return resolve(null);
                    }
                    return reject(err);
                }
                return resolve(secret.payload);
            });
        });
    };

    /**
     * Save the secret
     */
    public async saveSecret(secretName: string, secretValue?: string | null): Promise<void> {
        const createSecretResource = this._createSecretResource('POST', secretName);
        
        // Add secret to the Secret Store API; returns either error or secret object.
        return new Promise((resolve, reject) => {
            new createSecretResource(this._client).request({payload: secretValue}, function(err: Stripe.StripeRawError) {
                if (err) return reject(err);
                return resolve();
            });
        });
    };
};