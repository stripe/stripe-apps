import {
  Box,
  ContextView,
  Switch,
} from '@stripe/ui-extension-sdk/ui';
import {createHttpClient} from '@stripe/ui-extension-sdk/http_client';
import {useCallback, useState} from 'react';
import Stripe from 'stripe';

type CouponState = {
  [key: string]: null | 'pending' | string,
};

enum Discounts {
  industry = 'industry',
  loyalty = 'loyalty',
  senior = 'senior',
  repeat = 'repeat',
}

const discountTable: {[key in Discounts as string]?: number}= {
  industry: 10,
  loyalty: 5,
  senior: 15,
  repeat: 10,
};

const descriptionTable: {[key in Discounts as string]?: string} = {
  industry: '10% discount for people in the industry',
  loyalty: '5% discount for people who have bought 100 or more of this product',
  senior: '15% off for anybody over 65',
  repeat: '10% off for somebody buying this product for a third time',
};

const stripeClient = new Stripe('DUMMY_API_KEY', {
  httpClient: createHttpClient(),
  apiVersion: '2020-08-27',
});

const updateProductCouponMetadata = async (productId: string, newCouponState: CouponState) =>
  await stripeClient.products.update(productId, {
    metadata: newCouponState,
  });

const Couponer = ({object: {id: productId}}) => {
  const options = [
    {
      value: 'industry',
      label: 'Industry Discount',
      description: descriptionTable.industry,
    },
    {
      value: 'loyalty',
      label: 'Loyal Customer',
      description: descriptionTable.loyalty,
    },
    {
      value: 'senior',
      label: 'Senior Discount',
      description: descriptionTable.senior,
    },
    {
      value: 'repeat',
      label: 'Repeat Buyer',
      description: descriptionTable.repeat,
    },
  ];

  const [couponState, setCouponState] = useState({});

  const handleCouponChange = useCallback(
    async (value: string, on: boolean) => {
      setCouponState({
        ...couponState,
        [value]: 'pending',
      });
      if (on) {
        // Create coupon for this product
        const coupon = await stripeClient.coupons.create({
          name: `Mousetraps B — ${value}`,
          percent_off: discountTable[value],
          applies_to: {
            products: [productId],
          },
        });
        const newCouponState = {
          ...couponState,
          [value]: coupon.id,
        };
        await updateProductCouponMetadata(productId, newCouponState);
        setCouponState(newCouponState);
      } else {
        // Delete coupon for this product
        // TODO: Actually delete the coupon (need to get the metadata)
        const newCouponState = {
          ...couponState,
          [value]: null,
        };
        await updateProductCouponMetadata(productId, newCouponState);
        setCouponState(newCouponState);
      }
    },
    [couponState],
  );

  return (
    <ContextView
      title="Couponer"
      description="Enable HK Mousetrap's standard coupons for this product."
    >
        <Box css={{layout: 'column', gap: 'small'}}>
          {options.map(({value, description, label}) => (
            <Switch
              key={value}
              id={value}
              label={label}
              disabled={couponState[value] === 'pending'}
              value={couponState[value]}
              onChange={(e) => handleCouponChange(value, e.target.checked)}
            />
          ))}
      </Box>
    </ContextView>
  );
};

export default Couponer;
