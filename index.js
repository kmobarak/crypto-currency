import express from 'express';
import axios from 'axios';

const app = express();
const port = 3000;

app.use(express.static('public'));
app.set('view engine', 'ejs');

const fetchCryptoData = async (fromCurrency, toCurrency) => {
    const API_URL = 'https://www.alphavantage.co/query';
    const API_KEY = '0d67e8369fmsh8b8ad87273efb9ap14aadejsnf9be9b36b5af'; 

    try {
        const response = await axios.get(API_URL, {
            params: {
                function: 'CURRENCY_EXCHANGE_RATE',
                from_currency: fromCurrency,
                to_currency: toCurrency,
                apikey: API_KEY,
            },
        });

        const data = response.data['Realtime Currency Exchange Rate'];
        if (!data) {
            throw new Error('No data found in API response.');
        }

        return {
            fromCurrencyCode: data['1. From_Currency Code'],
            fromCurrencyName: data['2. From_Currency Name'],
            toCurrencyCode: data['3. To_Currency Code'],
            toCurrencyName: data['4. To_Currency Name'],
            exchangeRate: data['5. Exchange Rate'],
            lastRefreshed: data['6. Last Refreshed'],
            timeZone: data['7. Time Zone'],
            bidPrice: data['8. Bid Price'],
            askPrice: data['9. Ask Price'],
        };
    } catch (error) {
        console.error('Error fetching data from Alpha Vantage:', error.message);
        return null;
    }
};

app.get('/', async (req, res) => {
    const fromCurrency = req.query.from_currency || 'BTC'; 
    const toCurrency = req.query.to_currency || 'USD'; 

    console.log(`Fetching exchange rate: ${fromCurrency} to ${toCurrency}`);

    const cryptoData = await fetchCryptoData(fromCurrency, toCurrency);

    if (!cryptoData) {
        res.render('index', {
            error: 'Failed to fetch exchange rate data.',
            cryptoData: null,
        });
    } else {
        res.render('index', {
            error: null,
            cryptoData,
        });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

