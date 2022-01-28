import {render} from '@stripe/ui-extension-sdk/testing';
import {Button, Link} from '@stripe/ui-extension-sdk/ui'
import ShippingDetails from './ShippingDetails';

describe('ShippingDetails component', () => {
    let details = {
        service: "UPS Overnight",
        labelUrl: "https://example.com/label",
        trackingUrl: "https://example.com/tracking",
        shipmentId: "shipment_2345",
        rateId: "rate_12345",
        labelId: "lbl_12345",
        invoiceItemId: "ii_123455",
    };
    it('Shows the rate plan and links', () => {
        const {wrapper} = render(<ShippingDetails
            {...details}
            onResetShippingDetails={jest.fn()}
        />);
        expect(wrapper).toContainText('Invoice is shipping via UPS Overnight');
        expect(wrapper).toContainComponent(Link, {
            href: details.labelUrl,
        });
        expect(wrapper).toContainComponent(Link, {
            href: details.trackingUrl,
        });
    });
    it('Allows the user to remove the shipping details', () => {
        const handler = jest.fn();
        const {wrapper} = render(<ShippingDetails
            {...details}
            onResetShippingDetails={handler}
        />);
        wrapper.find(Button)?.trigger('onPress');
        expect(handler).toHaveBeenCalled();
    });
});