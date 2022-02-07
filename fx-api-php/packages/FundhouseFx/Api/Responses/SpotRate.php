<?php
    namespace FundhouseFx\Api\Responses;
    
    class Rate {
        public $timestamp;
        public $value;

        function __construct(int $timestamp, float $value)
        {
            $this->timestamp = $timestamp;
            $this->value = $value;
        }
    }

    class SpotRate {
        public $base_currency;
        public $quote_currency;
        private $rates;

        function __construct(string $base, string $quote)
        {
            $this->base_currency = $base;
            $this->quote_currency = $quote;
            $this->rates = array();
        }

        public function add_rate(int $timestamp, $float) 
        {
            array_push($this->rates, new Rate($timestamp, $float));
        }

        public function getAllProperties(){
            return get_object_vars( $this );
          }
    }
