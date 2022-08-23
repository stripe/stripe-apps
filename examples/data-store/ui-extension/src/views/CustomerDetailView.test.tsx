import {render, getMockContextProps} from "@stripe/ui-extension-sdk/testing";
import {ContextView} from "@stripe/ui-extension-sdk/ui";

import CustomerDetailView from "./CustomerDetailView";

describe("CustomerDetailView", () => {
  it("renders ContextView", () => {
    const {wrapper} = render(<CustomerDetailView {...getMockContextProps()} />);

    expect(wrapper.find(ContextView)).toContainText("save to reload this view");
  });
});
