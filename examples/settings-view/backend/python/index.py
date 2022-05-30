#! /usr/bin/env python3.10.4

"""
index.py
Settings-View Example.
Python 3.10.4 or newer required.
"""

import os
import json

import stripe
from dotenv import load_dotenv, find_dotenv
from flask import Flask, jsonify, make_response, request
from flask_cors import CORS

load_dotenv(find_dotenv())

# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
stripe.api_key = os.getenv('STRIPE_API_KEY')

app = Flask(__name__)
CORS(app)

# This Dict represents a database or other external infrastructure for
# the purposes of this example. In a production system you would need
# to set up a true persistent store.
db = {}

appSecret = os.getenv('APP_SECRET')


@app.route("/api/settings", methods=["POST"])
def save_user_settings():
    body = request.get_json()
    userData = {'user_id': body['user_id'], 'account_id': body['account_id']}

    # Note: The stripe-python library expects a very compact json string with no spaces between the keys and values
    # So we need to eliminate any space before and after comma (',') and colon (':'), hence using separators. 
    # Else, signature verification will fail.
    payload = json.dumps(userData, separators=(',', ':'))
    sig_header = request.headers['Stripe-Signature']

    try:
        stripe.WebhookSignature.verify_header(
            payload, sig_header, appSecret
        )
    except ValueError as e:
        # Invalid payload
        return make_response('payloadError', 400)
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        return make_response("VerificationError", 400)

    db[body.user_id] = {'user_id': body['user_id'], 'account_id': body['account_id'],
                        'country': body['country'], 'language': body['language']}

    return make_response("Success", 200)


@app.route("/api/settings/<key>", methods=["GET"])
def get_settings_by_id(key):
    storedSettings = db[key]
    if not storedSettings:
        return make_response("Not Found", 404)
    else:
        return make_response(jsonify(storedSettings), 200)
