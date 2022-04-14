const express = require("express");
const cors = require("cors");
const app = express();
const { Stripe } = require("stripe");
const stripe = new Stripe(process.env.STRIPE_API_KEY);

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
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    const account = event.account;
    switch (event.type) {
      // The "authorized" event will get sent when an account installs the App
      case "account.application.authorized":
        accountStore.set(account, { id: account, dateCreated: Date.now() });
        break;
      // The "deauthorized" event will get sent when an account uninstalls the App
      case "account.application.deauthorized":
        accountStore.delete(account);
        break;
    }

    response.json({ received: true });
  }
);

app.get("/account/:id", (req, res) => {
  const storedAccount = accountStore.get(req.params.id);
  if (storedAccount) {
    res.send(storedAccount);
  } else {
    res.sendStatus(404);
  }
});

app.listen(8080, () => console.log("Server started on http://localhost:8080"));
