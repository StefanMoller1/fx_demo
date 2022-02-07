SELECT
    spot_rate_id,
    base_currency_id,
    quote_currency_id,
    timestamp,
    value
FROM spot_rates
WHERE base_currency_id = :base_ccy_id AND quote_currency_id = :quote_ccy_id
ORDER BY timestamp DESC
LIMIT 1;