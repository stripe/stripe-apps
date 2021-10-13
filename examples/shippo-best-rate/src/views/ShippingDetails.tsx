import {
  AlignBox,
  Button,
  ButtonGroup,
  Body,
  Card,
  ModalView,
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
    <Card>
      <ModalView shown={confirmingDelete !== 'hidden'} title="Are you sure?" onClose={() => setConfirmingDelete('hidden')}
        actions={
          <ButtonGroup>
            <Button label="No" onClick={() => setConfirmingDelete('hidden')} />
            <Button label="Yes" onClick={handleResetShippingDetails} color="primary" pending={confirmingDelete==='pending'} />
          </ButtonGroup>
        }
      >
        Do you want to remove {service} from this invoice?
      </ModalView>
      <AlignBox justifyContent="space-between" padding={{vertical: 20, horizontal: 16}}>
        <Body>Invoice is shipping via {service}.</Body>
        <ButtonGroup>
          <Button icon="external" iconPosition="right" label="Track shipment" href={trackingUrl} target="shippo-tracking" />
          <Button icon="external" iconPosition="right" label="Print label" href={labelUrl} target="shippo-label" />
          <Button icon="trash" onClick={() => setConfirmingDelete('confirming')} label="Change shipping" hideLabel />
        </ButtonGroup>
      </AlignBox>
    </Card>
  );
}

export default ShippingDetails;
