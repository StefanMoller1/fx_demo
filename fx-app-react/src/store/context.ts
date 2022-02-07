/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, Dispatch, SetStateAction } from 'react';
import { Currency, ConversionRate, QuoteRates } from './types';

type CurrencyContextProps = [
  Currency[],
  Dispatch<SetStateAction<Currency[]>>
];
export const CurrencyContext = createContext<CurrencyContextProps>([[], () => { }]);

type QuoteContextProps = [
  QuoteRates | undefined,
  Dispatch<SetStateAction<QuoteRates | undefined>>
];
export const QuoteContext = createContext<QuoteContextProps>([undefined, () => { }]);

type HistoryContextProps = [
  ConversionRate | undefined,
  Dispatch<SetStateAction<ConversionRate | undefined>>
];
export const HistoryContext = createContext<HistoryContextProps>([undefined, () => { }]);