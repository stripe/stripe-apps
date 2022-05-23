#! /usr/bin/env python3.10.4

"""
index.py
Webhook Example.
Python 3.10.4 or newer required.
"""
import os
import datetime

import stripe
from dotenv import load_dotenv, find_dotenv
from flask import Flask, jsonify, make_response, request

load_dotenv(find_dotenv())

# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
stripe.api_key = os.getenv('STRIPE_API_KEY')

app = Flask(__name__)

# This Dictonary represents a database or other external infrastructure for
# the purposes of this example. In a production system you would need
# to set up a true persistent store.
accountStore = {}

endpoint_secret = os.getenv('STRIPE_WEBHOOK_SECRET')

@app.route("/webhook", methods=["POST"])
def contruct_webhook_event():
  payload = request.data
  sig_header = request.headers['STRIPE_SIGNATURE']
  event = None

  try:
    event = stripe.Webhook.construct_event(
      payload, sig_header, endpoint_secret
    )
  except ValueError as e:
    # Invalid payload
     return make_response("payloadError", 400)
  except stripe.error.SignatureVerificationError as e:
    # Invalid signature
    return make_response("WebhookError", 400)

  # Handle the event
  account = event.account
  # We also trigger on customer events for testing purposes because
  # application.authorized events cannot be triggered via the CLI yet.
  # change `account.application.authorized` to `customer.created` to test with CLI
  if event.type == 'account.application.authorized':

    accountData = stripe.Account.retrieve(account)
    accountStore[accountData.id] = { "id": accountData.id, "name": accountData.settings.dashboard.display_name, "dateCreated": datetime.datetime.now() }
  else:
    del accountStore[account]

  return make_response(jsonify({"received": True }), 200)


@app.route("/accounts", methods=["GET"])
def get_accounts():
  return make_response(jsonify({"data": accountStore}), 200)

    