# Stripe Apps High-Level Overview

Stripe Apps extend the Stripe Dashboard, giving you the ability to interact between Stripe and other data sources. Instead of switching from browser tab to browser tab to coordinate between Stripe and different SaaS products, you can bring 3rd party functionality directly into Stripe's Dashboard. These apps let you combine Stripe APIs, 3rd-party APIs, and the user experience of Stripe's Dashboard, to create streamlined workflows between multiple services.

## Discovering Apps in the Marketplace

Users of your app can discover it in the Stripe Apps Marketplace. This is a place where users can find apps that are available to them, and which they can install. In the Marketplace, your app listing will give prospective users [all the detail they need](https://stripe.com/docs/stripe-apps/marketplace/create-app-listing) to understand if it's right for them.

## Stripe Apps Drawer

Stripe Apps live in [a sidebar on the right-hand side](https://stripe.com/docs/stripe-apps/ui-toolkit/overview#user-experience) of the Dashboard. The custom user interface of each app extends the information and abilities available to users of the Stripe Dashboard.

Each App can have different views depending on what part of the Stripe Dashboard you're viewing. Each Dashboard page provides the App with context about what is being viewed, and this context can be used to fetch extra contextual information from APIs. This context also gives you an entry point into modifying Stripe data present in the current view.

For example, consider a Stripe App for an email marketing platform. From the Payments view in the Stripe Dashboard, you could see aggregate data for how recent campaigns contributed to the sales in the Dashboard. If you decided to view a specific customer instead, the App could show you which campaigns they've been part of and which one led to that customer converting.

## Interacting with APIs

Stripe Apps give the user access to Stripe's API, allowing them to retrieve and modify Stripe data through the App. Stripe Apps can also interact with [third-party APIs](https://stripe.com/docs/stripe-apps/extend-dashboard-user-interface#use-third-party-apis), allowing them to fetch external data. Combined, you can use Stripe Apps to create powerful workflows that connect Stripe and other services from within the Dashboard.

Imagine a customer support SaaS app that you want to integrate with the Stripe Dashboard. As you load the Stripe App, the context of the Stripe Customer is sent to your backend API. Your backend responds with data about that customer's support history. Your app can also hook into the support live chat, allowing a user to talk to your customer while they're inside the Stripe Dashboard. A live support case can take place entirely within the Stripe Dashboard.

Whatever data is available to you, you can display it and work with it through your Stripe App utilizing the available UI components.

## Updating Data

Actions taken within a Stripe App can update data [via the Stripe API](https://stripe.com/docs/stripe-apps/extend-dashboard-user-interface#use-stripe-apis). And if there is data on the Dashboard in your current view that needs to update because of actions in a Stripe App, it's easy to make sure that [the Dashboard is updated as well](https://stripe.com/docs/stripe-apps/extend-dashboard-user-interface#update-dashboard-data). This way, the data visible in Stripe, your app, and in third-party services stays visually in-sync.

## Webhooks

In addition to interacting with APIs, Stripe Apps can also interact with your backend through [webhooks](https://stripe.com/docs/stripe-apps/build-backend#receiving-events-webhooks). Webhooks are a way for Stripe to notify your app when something happens in the Stripe Dashboard. You can tell Stripe what URL on your backend to send webhooks to, and Stripe will send webhooks with event details to that URL whenever something happens in the Dashboard.

For example, if you were again building a customer service Stripe App, you might have a case where the user contacts you about a spelling error in their name. If you updated their name in the Stripe Dashboard to correct the error, a webhook would be sent to your backend, and your backend could update the customer's name in your database.