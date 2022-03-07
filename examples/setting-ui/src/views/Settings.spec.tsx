import {render} from '@stripe/ui-extension-sdk/testing';
import { Select, SettingsView, TextField } from '@stripe/ui-extension-sdk/ui';
import Settings from "./Settings";

describe("views/Settings", () => {
    let {wrapper} = render(<Settings />);
    beforeEach(() => {
        wrapper = render(<Settings />).wrapper;
    });
    it('Should wrapped by the Setting view', () => {
        expect(wrapper).toContainComponent(SettingsView, {
            onSave: expect.any(Function),
            statusMessage: '',
        });
    });
    describe.each([
        ["Username", TextField],
        ["Country", Select],
    ])("field (label: %p)", (label, targetElement) => {
        it('Should contain the onChange event handler', () => {
            expect(wrapper).toContainComponent(targetElement, {
                label,
                onChange: expect.any(Function),
            });
        });
    });
});
