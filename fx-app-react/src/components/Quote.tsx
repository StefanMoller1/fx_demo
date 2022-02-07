import React, { FC, useContext } from "react";
import { QuoteContext } from "store/context";
import styles from './Quote.module.css'

export const Quote: FC = () => {
  const [quoteRate] = useContext(QuoteContext)

  const currencyFormatter = (n: number): string => {
    return n.toFixed(2)
  }
  return (
    <div className={styles.fx_quote}>
      <span className={styles.fx_quote_amount}>
        {quoteRate
          ? `${quoteRate.base_currency} ${currencyFormatter(quoteRate.base_amount)}`
          : "$1.00"
        }
      </span>
      <span>=</span>
      <span className={styles.fx_quote_amount}>
        {quoteRate
          ? `${quoteRate?.quote_currency} ${currencyFormatter(quoteRate.converted_amount)}`
          : "R15,000"
        }
      </span>
    </div>
  )
}