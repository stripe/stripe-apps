const express = require("express");
require('dotenv').config();
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_API_KEY);

const app = express();
app.use(cors());
app.use(express.json());

const appSecret = process.env.APP_SECRET;
const db = new Map()


app.get("/api/settings/:key", async (req, res) => {
  const { key } = req.params;
  const userSetting = db.get(key);
  if (userSetting) {
    res.status(200).json(userSetting)
  } else {
    res.sendStatus(404);
  }
})


app.post("/api/settings", async (req, res) => {
  const sig = req.headers['stripe-signature'];

  const payload = JSON.stringify({
    user_id: req.body['user_id'],
    account_id: req.body['account_id']
  });
  try {
    stripe.webhooks.signature.verifyHeader(payload, sig, appSecret);
  } catch (error) {
    res.status(400).json(error);
    return;
  }
  const userSetting = db.get(req.body.user_id);

  //Removing all falsy values
  const receivedData = Object.entries(req.body).reduce(
    (acc, [key, val]) => (val ? ((acc[key] = val), acc) : acc),
    {}
  );

  db.set(req.body.user_id, { ...userSetting, ...receivedData });

  res.sendStatus(200)
});

app.listen(8080, () => console.log("Node server listening on port 8080!"));
