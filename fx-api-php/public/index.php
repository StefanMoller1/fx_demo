<?php
use DI\Container;
use FundhouseFx\Data\FxDatabase;
use Psr\Container\ContainerInterface;
use Slim\Factory\AppFactory;

// Load dependencies, both from composer and FundhouseFx source
require __DIR__ . '/../vendor/autoload.php';

// Import routers
require __DIR__ . '/Controllers/CurrenciesController.php';
require __DIR__ . '/Controllers/SpotRatesController.php';
require __DIR__ . '/Controllers/QuotesController.php';

// Create a container instance and register dependencies
$container = new Container();

$container->set('FxDatabase', function(){
    return new FxDatabase(__DIR__ . '/../resources/fundhouse_fx.db');
});

$container->set('CurrenciesController', function (ContainerInterface $container) {
    return new CurrenciesController($container);
});

$container->set('SpotRatesController', function (ContainerInterface $container) {
    return new SpotRatesController($container);
});

$container->set('QuotesController', function (ContainerInterface $container) {
    return new QuotesController($container);
});

AppFactory::setContainer($container);

// Create a Slim app instance
$app = AppFactory::create();

// Initialize error middleware
$app->addErrorMiddleware(true, true, true);

/*
 * Set up all of the routes using Slim Frameworks dynamic route resolution.
 * Slim will resolve the HTTP routes specified below dynamically using the Router instances
 * we registered with the Container instance earlier on.
 * 
 * See https://www.slimframework.com/docs/v4/objects/routing.html#container-resolution for more information.
*/

/* 
    Route: [GET] /currencies
    Description: Retrieves a list of supported currencies
*/
$app->get('/currencies', [\CurrenciesController::class, 'get_currencies']);

/* 
    Route: [GET] /rates
    Description: Retrieves a sorted collection of historic spot rates
*/
$app->get('/rates/{base}/{quote}', [\SpotRatesController::class, 'get_historic_spot_rates']);

/* 
    Route: [GET] /quotes
    Description: Converts the specified nominal amount (specified in the query string) from one currency to another
*/
$app->get('/quotes/{base}/{quote}', [\QuotesController::class, 'get_quote']);

$app->run();
?>