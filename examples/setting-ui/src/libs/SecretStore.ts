import Stripe from "stripe";
import { stripeClient } from "./stripe";

export type Options = {
    username: string | null;
    country: string | null;
}

export class SecretStore {
    private readonly _dbName: string;
    private readonly _client: Stripe = stripeClient;
    public constructor(dbName = "dummyproduct") {
        this._dbName = dbName;
    }

    private _getAPIPath(userId: string, secretName: string) {
        return `apps/secrets?scope[type]=user&scope[id]=${userId}&name=${secretName}&expand[]=payload`
    }

    /**
     * Call the secret store API
     */
    private async _getSecretResource(userId: string, secretName: string): Promise<string | null> {
        const getSecretResource = Stripe.StripeResource.extend({
            request: Stripe.StripeResource.method({
                method: 'GET',
                path: this._getAPIPath(userId, secretName),
            }),
        });
        
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
        const createSecretResource = Stripe.StripeResource.extend({
            request: Stripe.StripeResource.method({
                method: 'POST',
                path: this._getAPIPath(userId, secretName),
            })
        });
        
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