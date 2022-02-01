import type Shippo from 'shippo';

// This exists because the @types/shippo package is riddled with inaccurate types

type CommonAPI = {
  object_id: string,
  object_owner: string,
  object_created: string,
};
export type Rate = CommonAPI &
  Omit<Shippo.Rate, 'servicelevel'|'amount'> & {
    amount: string,
    arrives_by: string | null,
    carrier_account: string,
    duration_terms: string,
    estimated_days: number,
    provider_image_75: string,
    servicelevel: {
      extended_token: string,
      name: string,
      terms: string,
      token: string,
    },
    test: boolean,
  };
export type Shipment = CommonAPI &
  Omit<Shippo.Shipment, 'rates'> & {
    rates: Array<Rate>,
  };