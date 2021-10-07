# Create an App
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