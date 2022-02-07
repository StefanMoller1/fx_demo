<?php
    namespace FundhouseFx\Api\Responses;

    class Error {
        public $message;

        function __construct(string $message)
        {
            $this->name = $message;
        }
    }
?>