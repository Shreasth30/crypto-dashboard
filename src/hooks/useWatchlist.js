import { useState, useEffect, useRef } from 'react';

// Using localStorage for watchlist persistence
export function useWatchlist() {
    const [watchlist, setWatchlist] = useState(() => {
        try {
            const saved = localStorage.getItem('crypto_watchlist');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error('Error reading watchlist from local storage', e);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('crypto_watchlist', JSON.stringify(watchlist));
        } catch (e) {
            console.error('Error writing watchlist to local storage', e);
        }
    }, [watchlist]);

    const toggleCoin = (coinId) => {
        setWatchlist((prev) =>
            prev.includes(coinId)
                ? prev.filter((id) => id !== coinId)
                : [...prev, coinId]
        );
    };

    const isFavorite = (coinId) => watchlist.includes(coinId);

    return { watchlist, toggleCoin, isFavorite };
}
