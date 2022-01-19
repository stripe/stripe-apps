import Stripe from "stripe";
import { stripeClient } from "./stripe";

export type Options = {
    username: string;
    country: string;
}

/**
 * It's a dummy DB client to save and load any data.
 * The client will create a new Product to store the data using their metadata.
 * PLEASE DO NOT USE THIS for the real application and don't use for saving any secret!
 * @deprecated
 */
export class DummyDB {
    private readonly _dbName: string;
    private readonly _client: Stripe = stripeClient;
    public constructor(dbName = "dummyproduct") {
        this._dbName = dbName;
    }

    public async getOptions() {
        const data = await this._getOrCreateProduct();
        return data.metadata as Options;
    }

    public async saveOptions(options: Options) {
        const data = await this._getOrCreateProduct();
        await this._client.products.update(data.id, {
            metadata: options
        });
    }
    private async _getOrCreateProduct() {
        try {
            const product = await this._client.products.retrieve(this._dbName);
            return product;
        } catch (e) {
            if ((e as any).code !== 'resource_missing') throw e;
        }
        return this._client.products.create({
            id: this._dbName,
            name: '[DO NOT USE IT] Dummy DB object for the demo application'
        });
    }
}