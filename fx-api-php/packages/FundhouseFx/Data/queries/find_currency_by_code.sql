SELECT currency_id,
       currency_name,
       currency_iso_code,
       currency_symbol
FROM currencies
WHERE currency_iso_code = :iso_code 
LIMIT 1;