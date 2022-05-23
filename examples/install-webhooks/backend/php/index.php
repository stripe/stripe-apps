<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

use Stripe\Stripe;
use Stripe\Webhook;
use Stripe\Account;
use Stripe\Exception\SignatureVerificationException;

use Dotenv\Dotenv;

require __DIR__. '/vendor/autoload.php';

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->safeLoad();

$app = AppFactory::create();

Stripe::setApiKey($_ENV['STRIPE_API_KEY']);

// This path will receive all webhooks from connected accounts once it's added via the dashboard.
$app->post('/webhook', function (Request $request, Response $response) {
    $endpoint_secret = $_ENV['STRIPE_WEBHOOK_SECRET'];
    $payload = $request->getBody();
    $sig_header = $_SERVER['HTTP_STRIPE_SIGNATURE'];

    $event = null;

    try {
        $event = Webhook::constructEvent(
            $payload,
            $sig_header,
            $endpoint_secret
        );
    } catch (UnexpectedValueException $e) {
        // Invalid payload
        $response->withStatus(400);
        return $response;
    } catch (SignatureVerificationException $e) {
        // Invalid signature
        $response->withStatus(400);
        return $response;
    }
    switch ($event->type) {
        // The "authorized" event will get sent when an account installs the App
        case "account.application.authorized":
        // We also trigger on customer events for testing purposes because
        // application.authorized events cannot be triggered via the CLI yet
        case 'customer.created':
            $data = Account::retrieve($event->account);

            // In production, the data should be persisted to a database.
            // PHP does not run as a permanent service, so data is not persisted in-memory between sessions.
            $userAccountData = $data;
            break;
            // The "deauthorized" event will get sent when an account uninstalls the App
        default:
            // Handle cases that does not match the event type. E.g. deleting the account from your database
            // if the event->type is account.application.deauthorized. 
            break;
    }
    $response
        ->withHeader('Content-Type', 'application/json')
        ->withStatus(200);
    return $response;
});


$app->get('/accounts', function (Request $request, Response $response) {

    // In production, the user accounts should be retreived from your database
    // and update the code below to suit your use case.
    $response
        ->withHeader('Content-Type', 'application/json')
        ->withStatus(400)
        ->getBody()->write("User Id: " );
    return $response;
});


$app->run();
