<?php

// use FundhouseFx\Api\Responses\SpotRate;
use FundhouseFx\Api\Responses\SpotRate;
use Psr\Container\ContainerInterface;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface;

class SpotRatesController
{
    private $container;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    public function get_historic_spot_rates(Request $request, Response $response, array $args): ResponseInterface
    {
        $default_error_message = "unable to find spot rates";
        $err_message = "";
        $server_error = false;

        try {
            $base = $args['base'];
            if ($base == "") {
                $err_message = "invalid base currency";
                goto respond;
            }

            $quote = $args['quote'];
            if ($quote == "") {
                $err_message = "invalid quote currency";
                goto respond;
            }

            $db = $this->container->get('FxDatabase');

            // Get base currency model
            $base_currency = $db->find_currency($base);
            if ($base_currency == null) {
                $err_message = "invalid base currency";
                goto respond;
            }

            // Get quote currency model
            $quote_currency = $db->find_currency($quote);
            if ($quote_currency == null) {
                $err_message = "invalid quote currency";
                goto respond;
            }
            // Get unique conversion sets
            list($base_currencies, $sets) = $db->get_currency_sets();

            // Init blank reponse
            $resp = new SpotRate($base, $quote);

            if (in_array("{$base_currency->currency_id}.{$quote_currency->currency_id}", $sets)) {
                // Handle scenario where we have data on exact match exchage information
                $spots = $db->get_spot_rates($base_currency->currency_id, $quote_currency->currency_id, false);
                foreach ($spots as $spot) {
                    $resp->add_rate($spot->timestamp, $spot->value);
                }
            } else if (in_array("{$quote_currency->currency_id}.{$base_currency->currency_id}", $sets)) {
                // Handle scenario where we have data on exact reverse exchage information
                $spots = $db->get_spot_rates($quote_currency->currency_id, $base_currency->currency_id, false);
                foreach ($spots as $spot) {
                    $resp->add_rate($spot->timestamp, 1 / $spot->value);
                }
            } else {
                // Handle case where neither base or quote currency is has a base in the data. 
                // Find the first base that converts to both currencies
                foreach ($base_currencies as $value) {
                    if (
                        in_array("{$value}.{$base_currency->currency_id}", $sets)
                        && in_array("{$value}.{$quote_currency->currency_id}", $sets)
                    ) {
                        $base_spot_rate = $db->get_spot_rates($value, $base_currency->currency_id, false);
                        $quote_spot_rate = $db->get_spot_rates($value, $quote_currency->currency_id, false);
                        if (count($base_spot_rate) == 0 || count($quote_spot_rate) == 0) {
                            $err_message = $default_error_message;
                            goto respond;
                        }

                        $quote_spot_rate_map = array();
                        foreach ($quote_spot_rate as $value) {
                            $quote_spot_rate_map[$value->timestamp] = $value->value;
                        }

                        foreach ($base_spot_rate as $value) {
                            if (array_key_exists($value->timestamp, $quote_spot_rate_map)) {
                                $resp->add_rate(
                                    $value->timestamp,
                                    $quote_spot_rate_map[$value->timestamp] / $value->value
                                );
                            }
                        }
                        break;
                    }
                }
            }
        } catch (Exception $e) {
            $server_error = true;
            $err_message = $e;
        }

        respond:
        $response_code = 200;
        if ($server_error) {
            $body = json_encode(new Error($err_message));
            $response_code = 500;
        } else if ($err_message != "") {
            $body = json_encode(new Error($err_message));
            $response_code = 400;
        } else {
            $body = json_encode($resp->getAllProperties());
        }

        $response->getBody()->write($body);

        return $response
            ->withHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
            ->withHeader('Content-Type', 'application/json')
            ->withStatus($response_code);
    }
}
