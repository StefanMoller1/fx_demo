import React, { useState, useEffect } from "react";
import { Divider, Typography } from "antd";
import { CoverterForm } from "components/Converter";
import { MainApp, UIWrapper } from "Styles";
import { Quote } from "components/Quote";
import { RateHistory } from 'components/History'
import { Currency, ConversionRate, QuoteRates } from "store/types";
import { CurrencyContext, HistoryContext, QuoteContext } from "store/context";
import { getConversion, getCurrencies } from "api";

const { Title } = Typography;

const App = () => {
	const [currencies, setCurrencies] = useState<Currency[]>([]);
	const [quoteRate, setQuoteRate] = useState<QuoteRates | undefined>(undefined);
	const [currencyHistory, setCurrencyHistory] = useState<ConversionRate | undefined>(undefined)

	useEffect(() => {
		if (currencies.length == 0) {
			getCurrencies().then((currencies) => setCurrencies(currencies))
		}
	}, [])

	useEffect(() => {
		if (quoteRate) {

			getConversion(quoteRate.base_currency, quoteRate.quote_currency)
				.then((rates) => setCurrencyHistory(rates))
		}
	}, [quoteRate])

	return (
		<MainApp>
			<UIWrapper>
				<Title style={{ textAlign: "center" }}>Fundhouse FX</Title>
				<CurrencyContext.Provider value={[currencies, setCurrencies]}>
					<QuoteContext.Provider value={[quoteRate, setQuoteRate]}>
						<CoverterForm />
						<Divider />
						<Quote />

						<Divider />

						{/* <Table columns={gridColumns} dataSource={rates} pagination={false} /> */}
					</QuoteContext.Provider>
				</CurrencyContext.Provider>
				<HistoryContext.Provider value={[currencyHistory, setCurrencyHistory]} >
					<RateHistory />
				</HistoryContext.Provider>
			</UIWrapper>
		</MainApp>
	);
};

export default App;
