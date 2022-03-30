import Stripe from "stripe";
import { stripeClient } from "./stripe";

export type Options = {
    username: string | null;
    country: string | null;
}

export class SecretStore {
    private readonly _client: Stripe = stripeClient;

    private _getAPIPath(method: 'GET' | 'POST', userId: string, secretName: string) {
        const queryStrings = [
            'scope[type]=user',
            `scope[user]=${userId}`,
            `name=${secretName}`,
        ];
        if (method === 'GET') queryStrings.push('expand[]=payload');
        const queryString = queryStrings.join('&');
        if (method === 'GET') {
            return `apps/secrets/find?${queryString}`;
        }
        return `apps/secrets?${queryString}`;
    }

    private _createSecretResource(method: 'GET' | 'POST', userId: string, secretName: string,) {
        const resource = Stripe.StripeResource.extend({
            request: Stripe.StripeResource.method({
                method,
                path: this._getAPIPath(method, userId, secretName),
            }),
        });
        return resource;
    }

    /**
     * Call the secret store API
     */
    private async _getSecretResource(userId: string, secretName: string): Promise<string | null> {
        const getSecretResource = this._createSecretResource('GET', userId, secretName);
        return new Promise((resolve, reject) => {
            new getSecretResource(this._client).request({}, function(err: Error, secret: {
                payload: string | null;
            }) {
                if (err) return reject(err);
                return resolve(secret.payload);
            });
        });
    }

    private async _saveSecretResource(userId: string, secretName: string, secretValue?: string | null): Promise<void> {
        const createSecretResource = this._createSecretResource('POST', userId, secretName);
        
        // Add secret to the Secret Store API; returns either error or secret object.
        return new Promise((resolve, reject) => {
            new createSecretResource(this._client).request({payload: secretValue}, function(err: Error, secret: any) {
                if (err) return reject(err);
                return resolve(secret.payload);
            })
        })
    }

    public async getOptions(userId: string): Promise<Options> {
        const username = await this._getSecretResource(userId, 'username')
        const country = await this._getSecretResource(userId, 'country')
        return {
            username,
            country,
        };
    }

    public async saveOptions(userId: string, options: Options) {
        await this._saveSecretResource(userId, "username", options.username)
        await this._saveSecretResource(userId, "country", options.country)
    }
}