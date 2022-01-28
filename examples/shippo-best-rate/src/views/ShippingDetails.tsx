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
  const [deleting, setDeleting] = useState<boolean>(false)
  const handleResetShippingDetails = async() => {
    setDeleting(true);
    await onResetShippingDetails();
    setDeleting(false);
  }
  return (
    <Box css={{layout: 'column', gap: 'small'}}>
      <Box css={{font: 'body'}}>Invoice is shipping via {service}.</Box>
      <Divider />
      <Link href={trackingUrl} target="_blank">Track shipment</Link>
      <Link href={labelUrl} target="_blank">Print label</Link>
      <Button disabled={deleting} onPress={() => handleResetShippingDetails()}>Change shipping</Button>
    </Box>
  );
}

export default ShippingDetails;
