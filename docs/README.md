# 🧵 Get started

A quick introduction to Project Tailor 👋

## What is a Stripe App?
Stripe Apps extend the functionality of Stripe for developers and end users. Most apps are built by 3rd party developers for public distribution or private use, but Stripe developers also build apps internally to deliver new features and functionality for Stripe users.

![Overview](./core/app_overview.png)

As a developer, there are four primary ways to build new experiences on the Stripe platform: 
 
- Use our library of UI components and modules to add new features to the Stripe Dashboard 
- Store data with Stripe
- Make Stripe API requests on behalf of users
- Integrate with 3rd party services. 

## Capabilities and Concepts

Apps are the package of capabilities used to build a new experience for Stripe. Apps are declaratively defined via our [app manifest format](./manifest/README.md), and are packaged along with any supporting materials as a single artifact that you submit to Stripe for distribution.

The capabilities provided by Stripe are:

1. [**🧩 UI extensions for Dashboard**](./ui-extensions/README.md) enable developers to build new features and functionality directly into the Stripe Dashboard. UI Extensions can be used to augment existing Stripe workflows as well as create entirely new features. These extensions are hosted within the Dashboard and  take advantage of the UI toolkit, teams, permissions, security, and hosting already built into the Dashboard.

1. **🖥 App Backend [Coming soon]** enable developers to use their own backends, hosted outside of Stripe, to make Stripe API calls and listen to webhook events from Stripe on behalf of a Stripe user

1. **🤐 Secret Store [Coming soon]** enable developers to securely store cryptographic material in order to authenticate and communicate with external services.

1. **💾 Custom Objects [Coming soon]** enable developers to use the Stripe platform to store their own data in their own namespace within Stripe and associate data with Stripe objects, so it's easily discoverable and mappable.

## Create an app

[Learn how to create your first app](./create/README.md)

## Distribute your app

[Learn more about app distribution](./distribution/README.md)
