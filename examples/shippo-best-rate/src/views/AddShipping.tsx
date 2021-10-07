import {
  LoadingState,
  EmbedView,
} from '@stripe-internal/extensions-sail';
import {useStripeContext} from '@stripe/tailor-browser-sdk';

import {useEffect, useState, useCallback} from 'react';

import RatePicker from './RatePicker';
import type {ShippingDetailsMetadata} from './ShippingDetails';
import ShippingDetails from './ShippingDetails';
import stripeClient from './stripe_client';
import Stripe from 'stripe';

const logo = require('../shippo-logo.svg') as string;

const AddShipping = () => {
  const {object: {id: invoiceId}} = useStripeContext();
  const [shippingDetails, setShippingDetails] = useState<ShippingDetailsMetadata>();
  const [invoice, setInvoice] = useState<Stripe.Response<Stripe.Invoice>>();
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
    } = invoice.metadata;
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
    const delItem = stripeClient.invoiceItems.del(shippingDetails.invoiceItemId);
    const metadata: ShippingDetailsMetadata = {
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
    loadShippingDetails(invoiceId);
  }, [invoiceId]);
  let content: JSX.Element;
  if (!invoice) {
    content = <LoadingState size="medium" title="Loading shipping details" />;
  } else if(shippingDetails) {
    content = <ShippingDetails
      onResetShippingDetails={handleResetShippingDetails}
      {...shippingDetails}
    />;
  } else {
    content = <RatePicker invoice={invoice} onRatePicked={setShippingDetails} />;
  }
  return <EmbedView title="Shippo">{content}</EmbedView>;
};

export default AddShipping;
