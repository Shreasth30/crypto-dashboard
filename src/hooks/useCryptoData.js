import { useState, useEffect, useRef } from 'react';

// Cache for previous prices to determine flash color
export function useCryptoData(currency) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Keep track of previous prices: { coinId: number }
    const prevPricesRef = useRef({});

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
                throw new Error('Failed to fetch data');
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

            setData(jsonData);
            setError(null);
        } catch (err) {
            if (err.name !== 'AbortError') {
                setError(err.message);
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
