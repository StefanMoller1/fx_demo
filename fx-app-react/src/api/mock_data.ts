import { ConversionRate, Currency, QuoteRates } from "../store/types";

export const MockCurrencyResponse: Currency[] = [
  {
    "name": "South African Rand",
    "code": "ZAR",
    "symbol": "R"
  }, {
    "name": "US Dollar",
    "code": "USD",
    "symbol": "$"
  }, {
    "name": "British Pound",
    "code": "GBP",
    "symbol": "\u00a3"
  }, {
    "name": "Japanese Yen",
    "code": "JPY",
    "symbol": "\u00a5"
  }, {
    "name": "Euro",
    "code": "EUR",
    "symbol": "\u20ac"
  }
]
export const MockQuoteRatesResponse: ConversionRate = {
  "base_currency": "ZAR",
  "quote_currency": "USD",
  "rates": [
    {
      "timestamp": "2005-06-02T15:10:16",
      "value": 0.0653
    }
  ]
}

export const MockConversionRateResponse: QuoteRates = {
  "base_currency": "ZAR",
  "quote_currency": "USD",
  "base_amount": 10000,
  "converted_amount": 650
}