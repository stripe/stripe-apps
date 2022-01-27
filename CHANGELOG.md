# Changelog

## 2022-01-28
- Released version 1.1.7 of the SDK (@stripe/ui-extension-sdk)
    - Adds a "testing" module which includes helpers for writing Jest tests for apps. See [the docs](https://stripe.com/docs/stripe-apps/reference/testing) for details.
    - Fixes some components that take React nodes as props
        - `MenuGroup` now supports the `title` prop
        - `FocusView` now supports the `footerContent` prop
        - `SettingsView` now supports the `headerActions` prop
    - Some type fixes and grammar updates.