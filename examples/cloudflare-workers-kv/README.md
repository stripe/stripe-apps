# Tailor Cloudflare UI Extension Demo

An example Tailor UI Extension that fetches and displays data from a Cloudflare Worker and key value store.

To run this application, ensure you are setup by following the [UI Extension docs](https://stripe.dev/tailor-preview/super-secret-private-ui-docs/?path=/docs/getting-started-ui-extensions--page)

Once you have the `stripe-preview` CLI fork available, run the start command from the application directory:

```
stripe-preview apps start
```
_Make sure you install with `yarn` before serving!_


The code running as a Cloudflare Worker is included in the `cfworker.js` file.
