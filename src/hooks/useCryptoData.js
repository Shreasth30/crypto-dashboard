import { useState, useEffect, useRef } from 'react';

// Cache for previous prices to determine flash color
const EXCHANGE_RATES = {
    usd: 1,
    eur: 0.92,
    inr: 83.3
};

const convertData = (dataList, from, to) => {
    if (from === to || !dataList || dataList.length === 0) return dataList;
    const fromRate = EXCHANGE_RATES[from] || 1;
    const toRate = EXCHANGE_RATES[to] || 1;
    const multiplier = toRate / fromRate;

    return dataList.map(coin => ({
        ...coin,
        current_price: coin.current_price * multiplier,
        market_cap: coin.market_cap * multiplier,
        total_volume: coin.total_volume * multiplier,
        high_24h: coin.high_24h ? coin.high_24h * multiplier : coin.high_24h,
        low_24h: coin.low_24h ? coin.low_24h * multiplier : coin.low_24h,
        ath: coin.ath ? coin.ath * multiplier : coin.ath,
        atl: coin.atl ? coin.atl * multiplier : coin.atl,
        sparkline_in_7d: coin.sparkline_in_7d ? {
            ...coin.sparkline_in_7d,
            price: coin.sparkline_in_7d.price ? coin.sparkline_in_7d.price.map(p => p * multiplier) : []
        } : coin.sparkline_in_7d
    }));
};

export function useCryptoData(currency) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Keep track of previous prices: { coinId: number }
    const prevPricesRef = useRef({});
    const fetchedCurrencyRef = useRef('usd');

    const fetchData = async () => {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const apiUrl = import.meta.env.VITE_COINGECKO_API_URL || 'https://api.coingecko.com/api/v3';
            const res = await fetch(
                `${apiUrl}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=24h`,
                { signal: controller.signal }
            );

            clearTimeout(timeoutId);

            if (!res.ok) {
                throw new Error('Getting latest data for best result');
            }

            const jsonData = await res.json();

            // Compute previous prices before updating state
            const newPrevPrices = {};
            jsonData.forEach(coin => {
                const oldPrice = prevPricesRef.current[coin.id];
                let flash = null;
                if (oldPrice !== undefined && oldPrice !== coin.current_price) {
                    flash = coin.current_price > oldPrice ? 'up' : 'down';
                }
                coin._flash = flash;
                newPrevPrices[coin.id] = coin.current_price;
            });

            prevPricesRef.current = newPrevPrices;
            fetchedCurrencyRef.current = currency;

            setData(jsonData);
            setError(null);
        } catch (err) {
            if (err.name !== 'AbortError') {
                setError('Getting latest data for best result');
                // Client-side fallback conversion
                if (data && data.length > 0 && fetchedCurrencyRef.current !== currency) {
                    const converted = convertData(data, fetchedCurrencyRef.current, currency);
                    setData(converted);
                    fetchedCurrencyRef.current = currency;
                }
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchData();

        const intervalId = setInterval(fetchData, 30000); // Poll every 30s

        return () => clearInterval(intervalId);
    }, [currency]);

    return { data, loading, error };
}
