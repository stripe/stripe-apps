# Changelog

## 2022-04-28
- Released version 6.3.0 of the SDK
  - Add `Banner` component
  - Add deprecation warning for `Notice` component
  - Add `locale` to `ExtensionContextValue['oauthContext']`
  - Add `overflowWrap` and `wordBreak` to `Box` `css` properties
  - Add `textTransform` to `Box` and `Inline` `css` properties
  - Add `primaryAction`, `secondaryAction`, and `footerContent` properties to `ContextView`.
  - Add `whiteSpace` to `Box` `css` properties

## 2022-04-22
- Released version 6.2.0 of the SDK
  - `BarChart` and `LineChart` improvements:
    - Configurable axis formatting
    - Configurable value formatting
    - Configurable channel domains
    - Configurable channel ranges
    - Show/hide axis labels and ticks in charts
    - Show/hide grid lines in charts
    - Show/hide tooltips in chart presets
    - Show/hide legends in chart presets

## 2022-04-20
- Released version 6.1.0 of the SDK
    - Add a confirmation dialog to `FocusView`
    - Add `Chip` and `ChipList` components
    - Update the `getDashboardUserEmail` utility to return the email directly and reject the promise if there's an error
    - Fix React components not being accepted in the `label` prop of form elements
    - Expose `text-overflow: ellipsis` and `word-wrap: normal | break-word` on `Box` `css`
    - Add `country` to the account passed to extensions in the `userContext` property
    - Add `data:` URL support for the `Img` component - [docs](https://stripe.com/docs/stripe-apps/ui-toolkit/components/img#data-urls)
- Fixed
    - https://github.com/stripe/stripe-apps/issues/385
    - https://github.com/stripe/stripe-apps/issues/343
    - https://github.com/stripe/stripe-apps/issues/306
    - https://github.com/stripe/stripe-apps/issues/285
    - https://github.com/stripe/stripe-apps/issues/166
    - https://github.com/stripe/stripe-apps/issues/52

## 2022-04-06
- Released version 6.0.0 of the SDK
    - Deprecates email in view context
    - Consolidates utilites in /utils path
    - Fixes react-reconciler dependency issue affecting unit tests
- Fixed
    - https://github.com/stripe/stripe-apps/issues/369

## 2022-03-31
- Released version 5.0.1 of the SDK
    - Adds the `Accordion`, `Icon`, `Spinner`, and `Tooltip` components
    - Adds tooltips to `BarChart` and `LineChart`
    - Fix prop typing for `BarChart` and `LineChart`
    - Deprecates legacy view context parameters (details: https://github.com/stripe/stripe-apps/issues/297)
    - Enables setting width via `css={{ width: ... }}` on `Select`, `TextArea`, `TextField`, `Button`, and `Link`
    - Enables setting internal horizontal alignment via `css={{ alignX: ... }}` on `Button` and `Link`
    - Adds the `clipboardWriteText` function
    - Adds the `getDashboardUserEmail` function
- Fixed
    - https://github.com/stripe/stripe-apps/issues/261
    - https://github.com/stripe/stripe-apps/issues/251
    - https://github.com/stripe/stripe-apps/issues/47
    - https://github.com/stripe/stripe-apps/issues/49
    - https://github.com/stripe/stripe-apps/issues/43
    - https://github.com/stripe/stripe-apps/issues/293
    - https://github.com/stripe/stripe-apps/issues/112

## 2022-03-18
- Add Dropbox OAuth PKCE example app
- Released version 4.0.0 of the SDK
    - Deprecates the `slot` property
- Fixed https://github.com/stripe/stripe-apps/issues/244
- Released version 3.2.0 of the SDK
    - Adds the `createOAuthState` function
    - Adds `oauthContext` to the `ExtensionContextValue` type
- Released version 3.1.0 of the SDK
    - Adds support for the `Img` component

## 2022-03-11
- Released version 1.0.0 of Stripe Apps CLI plugin. Follow this [guide](https://stripe.com/docs/stripe-apps/getting-started) to install the CLI plugin.

## 2022-03-07
- Released version 3.0.0 of the SDK
    - Adds support for the `Notice`, `Charts`, and `Tabs` components
    - Breaking changes:
      - `ListItem`: Previously, content passed as children would be the primary content rendered in the component. Now, main content is passed to the `title` prop. The `description` slot has also been reassigned to a `secondaryTitle` prop.
      - `MenuTrigger`: This component has been deprecated in favor of a `trigger` prop on the `Menu` component. Slot API usage has also been removed.
      - Removed permissions from being passed into the user context.
- Fixed https://github.com/stripe/stripe-apps/issues/231

## 2022-02-25
- Released version 2.2.0 of the SDK
    - Adds `actions` prop to `ContextView`.
- Released version 2.1.0 of the SDK
    - Introduces `ButtonGroup` component.
    - Makes styling improvements to `Button`.
    - Allows hiding `error` and `description` on form controls via the `hiddenElements` prop.
    - Exposes invalid and size props on Select and TextArea.
    - Exposes defaultChecked attribute on Radio.
    - Exposes resizeable and rows props on TextArea.
- Fixed https://github.com/stripe/stripe-apps/issues/157
- Fixed https://github.com/stripe/stripe-apps/issues/158
- Fixed https://github.com/stripe/stripe-apps/issues/176
- Fixed https://github.com/stripe/stripe-apps/issues/195

## 2022-02-18
- Released CLI v0.1.7-apps-preview
    - You can now use the Stripe CLI to generate a SettingsView with the `add` command. See [the docs](https://stripe.com/docs/stripe-apps/reference/extensions-sdk-api) for details.
    - Stripe Apps CLI commands now requires authentication, validating that the user is logged in before attempting upload.
    - When uploading Apps, we will now prompt users to confirm before uploading.

## 2022-02-11
- Released version 2.0.3 of the SDK
    - Returns a promise from useRefreshDashboardData that resolves after dashboard data is refreshed.
    - Adds `fetchStripeSignature` method that optionally accepts additional request payload. Signature can be used to make authenticated request to your app's backend. See [the docs](https://stripe.com/docs/stripe-apps/build-backend#authenticate-ui-to-backend) for details.
    - Fixes an issue where the test element check method `.is` would sometimes fail to identify a component.
- Fixed https://github.com/stripe/stripe-apps/issues/104

## 2022-02-10
- Released version 2.0.2 of the SDK
    - Fixes an issue with the `testing` package in which comopnents with fragment props were not findable using `wrapper.find()`
    - Fixes an issue where certain components would throw an error if they had only one child
    - Updated example apps to use the latest version of the SDK
- Fixed [Hot Loading Bug](https://github.com/stripe/stripe-apps/issues/169)
- new Tabs component
- new FormFieldGroup component
- fixed https://github.com/stripe/stripe-apps/issues/122
- fixed https://github.com/stripe/stripe-apps/issues/133
- fixed https://github.com/stripe/stripe-apps/issues/132

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
