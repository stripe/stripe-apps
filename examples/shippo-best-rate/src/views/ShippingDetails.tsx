import {
  Button,
  Box,
} from '@stripe/ui-extension-sdk/ui';

import {useState, useCallback} from 'react';

export type ShippingDetailsMetadata = {
  shipmentId: string
  rateId: string,
  labelId: string,
  trackingUrl: string,
  labelUrl: string,
  service: string,
  invoiceItemId: string,
};

type Props = ShippingDetailsMetadata & {
  onResetShippingDetails: () => Promise<void>,
}

const ShippingDetails = ({service, labelUrl, trackingUrl, onResetShippingDetails}: Props) => {
  const [confirmingDelete, setConfirmingDelete] = useState<'hidden'|'confirming'|'pending'>('hidden')
  const handleResetShippingDetails = async() => {
    setConfirmingDelete('pending');
    await onResetShippingDetails();
    setConfirmingDelete('hidden')
  }
  console.log('Tracking url', trackingUrl);
  return (
    <Box css={{layout: 'column', gap: 'small'}}>
      <Box css={{font: 'body'}}>Invoice is shipping via {service}.</Box>
      <Button href={trackingUrl}>Track shipment</Button>
      <Button href={labelUrl}>Print label</Button>
      <Button onPress={() => handleResetShippingDetails()}>Change shipping</Button>
    </Box>
  );
}

export default ShippingDetails;
