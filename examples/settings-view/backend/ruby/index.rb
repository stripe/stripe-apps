require 'stripe'
require 'dotenv'
require 'sinatra'
require 'sinatra/cross_origin'
require "json"

Dotenv.load

Stripe.api_key = ENV['STRIPE_API_KEY']

set :port, 8080
set :allow_origin, :any
set :allow_methods, [:get, :post, :options]
set :allow_credentials, true
set :max_age, "1728000"
set :expose_headers, ['Content-Type']

# This Hash represents a database or other external infrastructure for
# the purposes of this example. In a production system you would need
# to set up a true persistent store.
db = Hash.new


# Handling Cors
configure do
  enable :cross_origin
end

before do
  response.headers['Access-Control-Allow-Origin'] = '*'
end

options "*" do
  response.headers["Allow"] = "GET, PUT, POST, DELETE, OPTIONS"
  response.headers["Access-Control-Allow-Headers"] = "Content-Type, stripe-signature"
  response.headers["Access-Control-Allow-Origin"] = "*"
  200
end

# Saving user settings
post '/api/settings' do
  content_type :json

  sig = request.env["HTTP_STRIPE_SIGNATURE"]
  request.body.rewind
  data = JSON.parse request.body.read

  payload = JSON.generate({ 
    user_id: data["user_id"], 
    account_id: data["account_id"] 
  })

  appSecret = ENV['APP_SECRET']
  
  begin
    Stripe::Webhook::Signature.verify_header(payload, sig, appSecret)
  rescue Stripe::SignatureVerificationError => e
    status 400
    return
  end 

  db[data["user_id"]] = { 
    user_id: data["user_id"], 
    account_id: data["account_id"], 
    country: data["country"], 
    language: data["language"] 
  }

  status 200
  return
end

# Retrieving user settings
get '/api/settings/:key' do
  content_type :json

  id = params["key"]
  storedSettings = db[id]
  
  if storedSettings == nil
    status 404
    return
  end
  status 200
  return storedSettings.to_json
end