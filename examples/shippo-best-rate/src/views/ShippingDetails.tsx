import {
  Button,
  Box,
  Divider,
  Link,
} from '@stripe/ui-extension-sdk/ui';

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

const ShippingDetails = ({ service }: Props) => {
  return (
    <Box css={{ layout: 'column', gap: 'small' }}>
      <Box css={{ font: 'body' }}>Invoice is shipping via {service}.</Box>
    </Box>
  );
}

export default ShippingDetails;
