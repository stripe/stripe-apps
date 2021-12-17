import {
  Button,
  View,
} from '@stripe/tailor-browser-sdk/ui';

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
    <View css={{layout: 'row', }}>
      <View css={{font: 'body'}}>Invoice is shipping via {service}.</View>
      <View css={{layout: 'row', gap: 'medium'}}>
        <Button icon="external" iconPosition="right" label="Track shipment" href={trackingUrl} target="shippo-tracking" />
        <Button icon="external" iconPosition="right" label="Print label" href={labelUrl} target="shippo-label" />
        <Button icon="trash" onClick={() => handleResetShippingDetails()} label="Change shipping" hideLabel />
      </View>
    </View>
  );
}

export default ShippingDetails;
