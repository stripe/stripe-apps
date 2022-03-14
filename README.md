<h1 align="center">
  Stripe Apps
  <br>
  <br>
</h1>

<h4 align="center">Extend the functionality of Stripe</h4>

🚨 This project is strictly confidential, and any information provided to you are covered under your **Unilateral NDA with Stripe**. 🚨

<hr>

In these docs, you'll find all the information you need to get started building apps for Stripe.

## Docs

The documentation is available at [https://stripe.com/docs/stripe-apps](https://stripe.com/docs/stripe-apps).

If you are working with designers, share the [Figma library](stripe–apps-design-library.fig) with them.

## Sample Apps

We have built a range of sample applications that demonstrates the capabilities of the platform.

You can find examples in [/examples](/examples)

## Browsing Issues

Issues are labeled as 'Bug', 'Feature Request', 'Enhancement', or 'Documentation'. In addition they are labeled with a relevant owning team.
We use the reactions on feature requests and enhancements to gauge interest, so please feel free to upvote, downvote, and comment on what is the most meaningful for your app. _We will regularly reporioritize issues based on your feedback._

**Quick Queries**

[All Upcoming UI Components](https://github.com/stripe/stripe-apps/issues?q=is%3Aissue+is%3Aopen+label%3Anew-component)

[All Bugs](https://github.com/stripe/stripe-apps/issues?q=is%3Aissue+is%3Aopen+label%3Abug)

## Raising Issues

If you would like to raise an issue, there are several issue templates available. Choose the one that makes the most sense to you from the following:

| Type            | “Think”                    |
| --------------- | -------------------------- |
| Bug             | “This is broken…”          |
| Feature Request | “Wouldn’t it be cool if…?” |
| Enhancement     | “It would be easier if…”   |
| Documentation   | “I can’t find how to…”     |

General questions should be asked in the [Stripe Discord](https://stripe.com/go/developer-chat) `#pvt-stripe-apps` channel. To gain access to the private channel, follow these steps:

1. Join the [Stripe Discord](https://stripe.com/go/developer-chat).
2. Request access to the private channel by letting your Stripe contact know your full Discord handle, including the 4 digit suffix. E.g. `name#1234`.

**Note: The Discord private channel is shared amongst all members of the private beta. Treat it as you would any public space on the Internet.**

## Friction Logs

We encourage you to share feedback through a format that we call for Friction logs. Friction logs are documents that describe the frustrations and delights of a product, focused around a specific use case. They're also intended to be brutally honest - feel free to vent or to praise!

You can use this template by the [Tensorflow team](https://github.com/tensorflow/community/blob/master/sigs/build/tensorflow-testing.md) to have a structure: [TensorFlow friction log template](https://docs.google.com/document/d/1HVG3t-mgGZKU4iMeguTWGejbnQ54qUTXwdCFkA5xHG0/edit)

## Contributing

To upgrade all `@stripe/ui-extension-sdk` packages in the example apps to the latest version, run:
```
node update-sdk
```

To run a typecheck and unit tests (if present) on all example apps, run:
```
node run-tests
```
