require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const { Stripe } = require("stripe");
const stripe = new Stripe(process.env.STRIPE_API_KEY);

// This Map represents a database or other external infrastructure for
// the purposes of this example. In a production system you would need
// to set up a true persistent store.
const accountStore = new Map();

app.use(cors());

app.post(
  // This path will receive all webhooks from connected accounts once it's added via the dashboard.
  "/webhook",
  express.raw({ type: "application/json" }),
  (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        request.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    console.log(event);
    const account = event.account;
    switch (event.type) {
      // The "authorized" event will get sent when an account installs the App
      case "account.application.authorized":
      // We also trigger on customer events for testing purposes because
      // application.authorized events cannot be triggered via the CLI yet
      case "customer.created":
        stripe.accounts.retrieve(account).then((account) => {
          console.log(account)
          accountStore.set(account.id, {
            id: account.id,
            name: account.settings.dashboard.display_name,
            dateCreated: Date.now(),
          });
        });
        break;
      // The "deauthorized" event will get sent when an account uninstalls the App
      case "account.application.deauthorized":
      case "customer.deleted":
        accountStore.delete(account);
        break;
    }

    response.json({ received: true });
  }
);

app.get("/accounts", (req, res) => {
  res.send(Array.from(accountStore.values()));
});

app.listen(8080, () => console.log("Server started on http://localhost:8080"));
