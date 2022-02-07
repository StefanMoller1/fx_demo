import React, { FC, useContext, useState, useEffect } from "react"
import { Button, Form, FormInstance, InputNumber, Select } from "antd";
import { SwapOutlined } from "@ant-design/icons";
import styles from './Converter.module.css';
import { Currency } from "store/types";
import { QuoteContext, CurrencyContext } from "store/context";
import { getQuote } from "api";

const { Option } = Select;

export const CoverterForm: FC = () => {
  const [currencies,] = useContext(CurrencyContext)
  const [, setQuoteRate] = useContext(QuoteContext)

  const [amount, setAmount] = useState<number>(1);
  const [baseCurrency, setBaseCurrency] = useState<Currency | undefined>(undefined);
  const [quoteCurrency, setQuoteCurrency] = useState<Currency | undefined>(undefined);

  const formRef = React.createRef<FormInstance<string>>();
  useEffect(() => {
    formRef.current?.setFieldsValue({
      base_ccy: baseCurrency?.code,
      quote_ccy: quoteCurrency?.code
    })
  }, [baseCurrency, quoteCurrency])



  const handleAmountChanged = (value: number) => {
    if (value) {
      setAmount(value);
    }
  };

  const handleBaseCurrencySelected = (value: string) => {
    if (value) {
      const baseCurrency: Currency | undefined = currencies.find(
        (currency: Currency) => currency.code === value
      );
      if (baseCurrency) {
        setBaseCurrency(baseCurrency);
      }
    }
  };

  const handleQuoteCurrencySelected = (value: string) => {
    if (value) {
      const quoteCurrency: Currency | undefined = currencies.find(
        (currency: Currency) => currency.code === value
      );
      if (quoteCurrency) {
        setQuoteCurrency(quoteCurrency);
      }
    }
  };

  const calculateCoversion = (bCurrency = baseCurrency?.code, qCurrency = quoteCurrency?.code) => {
    if (!bCurrency || !qCurrency) {
      return
    }

    getQuote(bCurrency, qCurrency, amount)
      .then((conversionRate) => {
        setQuoteRate(conversionRate)
      })
  }

  const getCurrencyIndex = (v: string | undefined): number | null => {
    if (!v) return null
    const _cIndex = currencies.map((e: Currency) => e.code)
    return _cIndex.indexOf(v)
  }

  const disableConvertButton = () => {
    if (baseCurrency?.code == quoteCurrency?.code) {
      return true
    }
    return quoteCurrency && baseCurrency ? false : true
  }

  const swapCurrencies = () => {
    const _baseCurrency = baseCurrency
    const _quoteCurrency = quoteCurrency

    setBaseCurrency(_quoteCurrency)
    setQuoteCurrency(_baseCurrency)
    calculateCoversion(_quoteCurrency?.code, _baseCurrency?.code)
  }

  return (
    <Form layout='inline' className={styles.fx_currency_conversion_form} ref={formRef}>
      <Form.Item name='amount' initialValue={amount}>
        <InputNumber
          name="amount"
          addonBefore={baseCurrency?.symbol || "?"}
          placeholder='Amount'
          value={amount}
          onChange={handleAmountChanged}
        />
      </Form.Item>
      <Form.Item name='base_ccy' >
        <Select showSearch placeholder='Select a base currency'
          onSelect={handleBaseCurrencySelected}
          value={baseCurrency?.code}>
          {currencies.map((ccy: Currency) => (
            <Option key={getCurrencyIndex(ccy.code)} value={ccy.code}>
              {ccy.symbol} - {ccy.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item>
        <Button icon={<SwapOutlined />} title='Switch' onClick={swapCurrencies} />
      </Form.Item>
      <Form.Item name='quote_ccy' >
        <Select showSearch placeholder='Select a quote currency'
          onChange={handleQuoteCurrencySelected}
          value={quoteCurrency?.code}>
          {currencies.map((ccy: Currency, index: number) => (
            <Option key={index} value={ccy.code}>
              {ccy.symbol} - {ccy.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item shouldUpdate>
        <Button
          type='primary'
          htmlType='button'
          onClick={() => calculateCoversion()}
          disabled={disableConvertButton()}
        >
          Convert
        </Button>
      </Form.Item>
    </Form>
  )
}