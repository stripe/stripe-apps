import RatePicker from './RatePicker';
import {render} from '@stripe/ui-extension-sdk/testing';
import {List, ListItem} from '@stripe/ui-extension-sdk/ui';
import {invoice, invoiceItem, shippoShipment, shippoTransaction} from './__mocks__/mock_objects';

jest.mock('./shippo_client');
jest.mock('./stripe_client');

describe('RatePicker component', () => {
  it('displays a list of rates', async () => {
    const onRatePicked = jest.fn();
    const {wrapper, update} = render(<RatePicker invoice={invoice} onRatePicked={onRatePicked} />);
    expect(wrapper).toContainText('Loading shipping rates from Shippo…');
    await update();
    expect(wrapper).toContainComponent(List);
    const rate = shippoShipment.rates[0];
    expect(wrapper.find(ListItem)).toContainText(rate.servicelevel.name);
    expect(wrapper.find(ListItem)).toContainText(rate.duration_terms);
  });
  it('creates a new shipping label when a rate is clicked', async () => {
    const onRatePicked = jest.fn();
    const {wrapper, update} = render(<RatePicker invoice={invoice} onRatePicked={onRatePicked} />);
    expect(wrapper).toContainText('Loading shipping rates from Shippo…');
    await update();
    const rate = shippoShipment.rates[0];
    wrapper.find(List)?.trigger('onAction', rate.object_id);
    await update();
    expect(onRatePicked).toHaveBeenCalledWith({
        rateId: rate.object_id,
        shipmentId: shippoShipment.object_id,
        labelId: shippoTransaction.object_id,
        service: `${rate.provider} ${rate.servicelevel.name}`,
        trackingUrl: shippoTransaction.tracking_url_provider,
        labelUrl: shippoTransaction.label_url,
        invoiceItemId: invoiceItem.id,
      })
  });
})