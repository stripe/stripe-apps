require 'stripe'
require 'dotenv'
require 'sinatra'
require 'date'

Dotenv.load

Stripe.api_key = ENV['STRIPE_API_KEY']
set :port, 8080

# This Hash represents a database or other external infrastructure for
# the purposes of this example. In a production system you would need
# to set up a true persistent store.
accountStore = Hash.new

post '/webhook' do
  content_type 'application/json'

  sig = request.env["HTTP_STRIPE_SIGNATURE"]
  payload = request.body.read
  endpoint_secret = ENV['STRIPE_WEBHOOK_SECRET']
  event = nil
  
  begin
    event = Stripe::Webhook.construct_event(
      payload, sig, endpoint_secret
    )
  rescue Stripe::SignatureVerificationError => e
    status 400
    puts "Webhook Error: #{e.message}"
    return
  end 
 
  account = event.account
  case event.type
    # The "authorized" event will get sent when an account installs the App
  when "account.application.authorized"
    # We also trigger on customer events for testing purposes because
    # application.authorized events cannot be triggered via the CLI yet
  when "customer.created":
    accountData = Stripe::Account.retrieve(account)
    accountStore[accountData.id] = { id: accountData.id, name: accountData.settings.dashboard.display_name, dateCreated: Date.today }

    # The "deauthorized" event will get sent when an account uninstalls the App
  else
    accountStore.delete(accountData.id)
  end
  
  status 200
  return { "received": true }.to_json
end

get '/accounts' do
  content_type 'application/json'
  storedAccount = accountStore.values
  return storedAccount.to_json
  status 200
end

