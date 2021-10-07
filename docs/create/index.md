# Create an App

In this doc, you'll use Stripe CLI to create an app and generate the boilerplate code for building your app and automates many common development tasks.

## Scenario

You want to build an App, that is using the `UI extension` capability to extend the Stripe Dashboard. Since this is your first time creating a Stripe app, you want to start with boilerplate code that makes your programming experience easier and more efficient.

You can look through some [example apps](../examples) to get a better idea of the different things that are possible.

## Step 1: Flag yourself into Tailor (Stripes)

1. Go to https://dashboard.stripe.com/
1. Use the developer tools to find your `merchant id`
![](./merchant_id_1.png)
![](./merchant_id_2.png)

1. Go [https://amp.corp.stripe.com/feature-flags/flag/tailor_ui_extensions](https://amp.corp.stripe.com/feature-flags/flag/tailor_ui_extensions)
1. Add your `merchant id` to the list
1. Get a member of the `Tailor App Platform team` to approve

## Step 2: Get the forked Stripe CLI 
1. Get a build of the [Stripe CLI from the tailor-preview repository](../cli/stripe-preview)
2. Download it to a convenient location where you can easily call in from your terminal.

## Step 3: Bootstrap your app
```sh
$ stripe-preview tailor new [name]
```

This will create a new, minimal tailor.json file.

## Step 4: Serve your app in development mode

```sh
$ stripe-preview tailor serve
```