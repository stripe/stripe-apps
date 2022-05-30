<?php

use Dotenv\Dotenv;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;
use Stripe\Stripe;
use Stripe\WebhookSignature;

require __DIR__ . '/vendor/autoload.php';

Dotenv::createImmutable(__DIR__)->safeLoad();

$app = AppFactory::create();

Stripe::setApiKey($_ENV['STRIPE_API_KEY']);

$app->addErrorMiddleware(false, false, false);

$app->get('/api/settings/{key}', function (Request $request, Response $response, array $args) {
    $key = $args['key'];

    // In production, the settings should be retrieved from your database using the $key here
    // and update the code below to suit your use case.
    $response->getBody()->write(json_encode([
        'country' => 'Netherlands',
        'language' => 'English',
        'user_id' => $key,
        'account_id' => 'Dummy account'
    ]));
    return $response->withHeader('Content-Type', 'application/json');
});

$app->post('/api/settings', function (Request $request, Response $response) {
    $header = $request->getHeaderLine('stripe-signature');
    $body = $request->getParsedBody();
    $payload = json_encode(['account_id' => $body['account_id'], 'user_id' => $body['user_id']]);

    try {
        WebhookSignature::verifyHeader($payload, $header, $_ENV['APP_SECRET']);
        // In production, the data should be persisted to a database.
        // PHP does not run as a permanent service, so data is not persisted in-memory between sessions.
        $fakeStorage = [$body['user_id'] => $body];
        return $response->withStatus(200);
    } catch (Exception) {
        return $response->withStatus(400);
    }
});

$app->run();
