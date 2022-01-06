import {
  ContextView,
  Switch,
  View,
} from '@stripe/ui-extension-sdk/ui';
import {createHttpClient} from '@stripe/ui-extension-sdk/http_client';
import {useCallback, useState} from 'react';
import Stripe from 'stripe';

type CouponState = {
  [key: string]: null | 'pending' | string,
};

const discountTable = {
  industry: 10,
  loyalty: 5,
  senior: 15,
  repeat: 10,
};

const productId = 'prod_JzavXUOurPJpDZ';

const descriptionTable = {
  industry: '10% discount for people in the industry',
  loyalty: '5% discount for people who have bought 100 or more of this product',
  senior: '15% off for anybody over 65',
  repeat: '10% off for somebody buying this product for a third time',
};

const stripeClient = new Stripe('DUMMY_API_KEY', {
  httpClient: createHttpClient(),
  apiVersion: '2020-08-27',
});

const updateProductCouponMetadata = async (newCouponState: CouponState) =>
  await stripeClient.products.update(productId, {
    metadata: newCouponState,
  });

const Couponer = () => {
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
        // Ceate coupon for this product
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
        await updateProductCouponMetadata(newCouponState);
        setCouponState(newCouponState);
      } else {
        // Delete coupon for this product
        // TODO: Actually delete the coupon (need to get the metadata)
        const newCouponState = {
          ...couponState,
          [value]: null,
        };
        await updateProductCouponMetadata(newCouponState);
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
        <View css={{gap: 'medium'}}>
          {options.map(({value, description, label}) => (
            <View>
              <Switch
                key={value}
                id={value}
                description={description}
                label={label}
                disabled={couponState[value] === 'pending'}
                value={couponState[value]}
                onChange={(on: boolean) => handleCouponChange(value, on)}
              />
            </View>
          ))}
      </View>
    </ContextView>
  );
};

export default Couponer;
