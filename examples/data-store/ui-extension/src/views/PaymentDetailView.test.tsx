import {render, getMockContextProps} from "@stripe/ui-extension-sdk/testing";
import {ContextView} from "@stripe/ui-extension-sdk/ui";

import PaymentDetailView from "./PaymentDetailView";

describe("PaymentDetailView", () => {
  it("renders ContextView", () => {
    const {wrapper} = render(<PaymentDetailView {...getMockContextProps()} />);

    expect(wrapper.find(ContextView)).toContainText("save to reload this view");
  });
});
