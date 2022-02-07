<?php
namespace FundhouseFx\Data;

use SQLite3;
use FundhouseFx\Data\Model\Currency;
use FundhouseFx\Data\Model\SpotRate;

class FxDatabase extends SQLite3 {
    function __construct(string $db_path)
    {
        $this->open($db_path);
    }

    function get_currencies() {
        $query_text = file_get_contents(__DIR__ . '/queries/get_currencies.sql');
        $results = $this->query($query_text) or die('Failed to fetch ');
        $currencies = array();
        
        while($row = $results->fetchArray()){
            array_push($currencies, new Currency(
                $row['currency_id'],
                $row['currency_name'],
                $row['currency_iso_code'],
                $row['currency_symbol']
            ));
        }
        return $currencies;
    }

    function find_currency(string $iso_code){
        $query_text = file_get_contents(__DIR__ . '/queries/find_currency_by_code.sql');
        $statement = $this->prepare($query_text);
        
        $statement->bindValue(':iso_code', $iso_code);

        $results = $statement->execute();
        $currency = null;
        
        while($row = $results->fetchArray()){
            $currency = new Currency(
                $row['currency_id'],
                $row['currency_name'],
                $row['currency_iso_code'],
                $row['currency_symbol']
            );
            break;
        }

        $statement->close();

        return $currency;
    }

    function get_spot_rates(int $base_currency_id, int $quote_currency_id, bool $last ){
        if ($last) {
            $query_text = file_get_contents(__DIR__ . '/queries/get_last_spot_rates.sql');
        } else {
            $query_text = file_get_contents(__DIR__ . '/queries/get_spot_rates.sql');
        }
        $statement = $this->prepare($query_text);

        $statement->bindValue(':base_ccy_id', $base_currency_id);
        $statement->bindValue(':quote_ccy_id', $quote_currency_id);

        $results = $statement->execute();
        $spots = array();
        
        while($row = $results->fetchArray()){
            array_push($spots, new SpotRate(
                $row['spot_rate_id'],
                $row['base_currency_id'],
                $row['quote_currency_id'],
                $row['timestamp'],
                $row['value']
            ));
        }

        $statement->close();

        return $spots;
    }

    function get_currency_sets(){
        $query_text = file_get_contents(__DIR__ . '/queries/get_currency_sets.sql');
        $statement = $this->prepare($query_text);

        $results = $statement->execute();
        $base_currency = array();
        $currencies = array();
        
        while($row = $results->fetchArray())
        {
            if (!in_array($row['base_currency_id'], $base_currency)) {
                array_push($base_currency, $row['base_currency_id']);
            }
            array_push($currencies, "{$row['base_currency_id']}.{$row['quote_currency_id']}" );
        }

        $statement->close();

        return array($base_currency, $currencies);
    }

    
    function __destruct()
    {
        $this->close();
    }
}
?>