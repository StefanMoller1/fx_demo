export type Currency = {
  name: string
  code: string
  symbol: string
}

type rates = {
  timestamp: string
  value: number
}

export type ConversionRate = {
  base_currency: string
  quote_currency: string
  rates: rates[]
}

export type QuoteRates = {
  base_currency: string
  quote_currency: string
  base_amount: number
  converted_amount: number
}