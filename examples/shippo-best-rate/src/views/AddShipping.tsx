import {
  ContextView,
  Box,
} from '@stripe/ui-extension-sdk/ui';

import {useEffect, useState, useCallback} from 'react';

import RatePicker from './RatePicker';
import type {ShippingDetailsMetadata} from './ShippingDetails';
import ShippingDetails from './ShippingDetails';
import stripeClient from './stripe_client';
import Stripe from 'stripe';
import invariant from 'ts-invariant';
import type { ExtensionContextValue } from '@stripe/ui-extension-sdk/context';

const AddShipping = ({environment}: ExtensionContextValue) => {
  invariant(environment, 'Unexpectedly null environment');
  const invoiceId = environment?.objectContext?.id;
  const [shippingDetails, setShippingDetails] = useState<ShippingDetailsMetadata|null>();
  const [invoice, setInvoice] = useState<Stripe.Invoice>();
  const loadShippingDetails = async (invoiceId: string) => {
    const invoice = await stripeClient.invoices.retrieve(invoiceId);
    const {
        shipmentId,
        rateId,
        labelId,
        trackingUrl,
        labelUrl,
        service,
        invoiceItemId,
    } = invoice.metadata || {};
    if (shipmentId) {
      setShippingDetails({
        shipmentId,
        rateId,
        labelId,
        trackingUrl,
        labelUrl,
        service,
        invoiceItemId,
      });
    }
    setInvoice(invoice);
  }
  const handleResetShippingDetails = useCallback(async () => {
    invariant(shippingDetails, 'Attempted to reset shipping details when there were none');
    invariant(invoice, 'Resetting shipping details without an invoice');
    const delItem = stripeClient.invoiceItems.del(shippingDetails.invoiceItemId);
    const metadata: Record<keyof ShippingDetailsMetadata, null> = {
      shipmentId: null,
      rateId: null,
      labelId: null,
      trackingUrl: null,
      labelUrl: null,
      service: null,
      invoiceItemId: null,
    };
    const resetMeta = stripeClient.invoices.update(invoice.id, {metadata});
    await Promise.all([delItem, resetMeta]);
    setShippingDetails(null);
  }, [shippingDetails, invoice]);

  useEffect(() => {
    if (invoiceId) {
      loadShippingDetails(invoiceId);
    }
  }, [invoiceId]);
  let content: JSX.Element;
  if (!invoice) {
    content = <Box>Loading shipping details...</Box>
  } else if(shippingDetails) {
    content = <ShippingDetails
      onResetShippingDetails={handleResetShippingDetails}
      {...shippingDetails}
    />;
  } else {
    content = <RatePicker invoice={invoice} onRatePicked={setShippingDetails} />;
  }
  return <ContextView title="Shippo">{content}</ContextView>;
};

export default AddShipping;
