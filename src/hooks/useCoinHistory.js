import { useState, useEffect } from 'react';

export function useCoinHistory(coinId, currency, days, sparklineData) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!coinId) return;

        // If requesting 7D and we have sparkline data, use it to avoid rate limits
        if (days === '7' && sparklineData && sparklineData.length > 0) {
            const now = Date.now();
            const hourMs = 60 * 60 * 1000;
            // sparklineData typical holds 168 hours of data (oldest to newest)
            const length = sparklineData.length;
            const formattedData = sparklineData.map((price, index) => ({
                time: now - ((length - 1 - index) * hourMs),
                price: price
            }));
            setData(formattedData);
            setLoading(false);
            setError(null);
            return;
        }

        let isMounted = true;

        const fetchHistory = async () => {
            setLoading(true);
            setError(null);
            try {
                const apiUrl = import.meta.env.VITE_COINGECKO_API_URL || 'https://api.coingecko.com/api/v3';
                const res = await fetch(`${apiUrl}/coins/${coinId}/market_chart?vs_currency=${currency}&days=${days}`);
                if (!res.ok) throw new Error('Failed to fetch historical data (API Rate Limit likely). Try a different timeframe later.');

                const json = await res.json();

                if (isMounted) {
                    const formattedData = json.prices.map(([timestamp, price]) => ({
                        time: timestamp,
                        price: price,
                    }));
                    setData(formattedData);
                }
            } catch (err) {
                if (isMounted) setError(err.message);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchHistory();

        return () => { isMounted = false; };
    }, [coinId, currency, days, sparklineData]);

    return { data, loading, error };
}
