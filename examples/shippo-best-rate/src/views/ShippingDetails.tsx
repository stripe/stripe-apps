import {
  Button,
  Box,
  Divider,
  Link,
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
  return (
    <Box css={{layout: 'column', gap: 'small'}}>
      <Box css={{font: 'body'}}>Invoice is shipping via {service}.</Box>
      <Divider />
      <Link href={trackingUrl} target="_blank">Track shipment</Link>
      <Link href={labelUrl} target="_blank">Print label</Link>
      <Button onPress={() => handleResetShippingDetails()}>Change shipping</Button>
    </Box>
  );
}

export default ShippingDetails;
