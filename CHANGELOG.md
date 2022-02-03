# Changelog

## 2022-02-02
- Released version 2.0.0 of the SDK (@stripe/ui-extension-sdk)
    - Fixes a render error with `SettingsView`
    - Updates `SettingsView` types to match the available component props
    - Adds a `getMockContextProps` helper for testing. See [the docs](https://stripe.com/docs/stripe-apps/reference/ui-testing#mock-context-props) for details.
    - List component now accepts `React.ReactNode` as a valid type to the `value` prop, rather than just a `string`.
    - Adds hover state to ListItem components
    - Updates ListItem component such that hover state is only visible when there is an action associated
    - Fix Select rendering when multiple is true
    - Fix Checkbox onChange firing twice

## 2022-01-28
- Released version 1.1.7 of the SDK (@stripe/ui-extension-sdk)
    - Adds a "testing" module which includes helpers for writing Jest tests for apps. See [the docs](https://stripe.com/docs/stripe-apps/reference/ui-testing) for details.
    - Fixes some components that take React nodes as props
        - `MenuGroup` now supports the `title` prop
        - `FocusView` now supports the `footerContent` prop
        - `SettingsView` now supports the `headerActions` prop
	- Some type fixes and grammar updates.
- Updates to the Stripe dashboard
    - The `onChange` handler for `TextArea` now provides `e.target.value`
    - Checkbox on/off and other visual states are now consistent with the rest of the dashboard
    - Checkbox no longer emits duplicate `onChange` events
    - A select with the `multiple` prop now renders properly
    - `baseline` alignment is fixed
    - `ListItem` components should appear clickable
- Released CLI v0.1.6-apps-preview
    - Adds a remove command that enables developers to remove views from their UI extensions via the CLI
    - Fixes #96
    - When creating a new app, the CLI now adds a simple test and the dependencies required to run tests
- [Updated Todo example with FocusView](https://github.com/stripe/stripe-apps/pull/116)
