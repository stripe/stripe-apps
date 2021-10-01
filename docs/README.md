Stripe Apps
-----------

Welcome to the new, improved Stripe App platform! 
# Introduction
Stripe Apps allow developers to customize and extend how Stripe works in order to support each business's unique needs.

Apps allow you to store custom data with Stripe, build custom UIs inside of Stripe's UIs, interact with the Stripe API, and more. They can be privately installed on a single account or distributed to others via the Stripe App Marketplace.

Stripe Apps can take advantage of an array of platform capabilities.
## 🧩 UI extensions
UI Extensions allow apps to extend the Stripe Dashboard with their own custom UI.

[Learn more about building your own UI extension.](./ui-extensions/readme.md)
## 🖥 App backend
Stripe apps can call their own backends as well as register webhooks to receive events from accounts that have the app installed.

## 💾 [Coming soon!] Custom objects
Custom objects allow developers to store their own data inside of Stripe. They can enforce constraints on it, Aassociate it with Stripe objects, and configure how the data is presented in the Stripe Dashboard.

## 🤐 [Coming soon!] Secret store
The Stripe Secret Store will allow developers to securely store cryptographic material in order to authenticate and communicate with external services.

# Creating a Stripe App
There's three basic steps to making an app that works with the Stripe platform.
1. Download and setup the preview of the [Stripe CLI](../cli/stripe-preview)
1. Create a [tailor.json file](./tailor.json.md) that describes the app's functionality (this is easily done with the Stripe CLI)
1. After building the app, submit it to Stripe via the CLI

You can look through some [example apps](../examples) to get a better idea of the different things that are possible.

## Getting started
### Prerequisites
1. Get a build of the [Stripe CLI from the tailor-preview repository](../cli/stripe-preview)
1. If you haven't already been flagged into the Tailor preview by a Stripe employee, ask your Stripe contact to do so.

## Bootstrapping a new app
```sh
$ stripe-preview app new [name]
```
This will create a new, minimal tailor.json file.

## Building some features

- [Building UI within the Stripe Dashboard](./ui-extensions/readme.md#getting-started)
- [Coming soon!] Configuring custom data to store in Stripe
- Create webhooks to allow 