import { ConversionRate, Currency, QuoteRates } from "../store/types";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { MockConversionRateResponse, MockCurrencyResponse, MockQuoteRatesResponse } from "./mock_data";

const host = "http://localhost:8000"

export const getCurrencies = async (): Promise<Currency[]> => {
  // return MockCurrencyResponse
  try {
    const response = await fetch(host + '/currencies');
    if (response.ok) {
      const resp: Currency[] = await response.json()
      return resp
    }
    return []
  } catch (err) {
    return []
  }
}

export const getConversion = async (base: string, quote: string): Promise<ConversionRate | undefined> => {
  // return MockQuoteRatesResponse
  try {
    const response = await fetch(host + `/rates/${base}/${quote}`);
    if (response.ok) {
      const resp: ConversionRate = await response.json()
      return resp
    }
    return undefined
  } catch (err) {
    return undefined
  }
}

export const getQuote = async (base: string, quote: string, amount: number): Promise<QuoteRates | undefined> => {
  // return MockConversionRateResponse
  try {
    const response = await fetch(host + `/quotes/${base}/${quote}?amount=${amount}`);
    if (response.ok) {
      const resp: QuoteRates = await response.json()
      return resp
    }
    return undefined
  } catch (err) {
    return undefined
  }
}