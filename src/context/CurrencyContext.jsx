import { createContext, useContext, useState } from 'react';

const CurrencyContext = createContext();

const currencySymbols = {
    usd: '$',
    eur: '€',
    inr: '₹'
};

export function CurrencyProvider({ children }) {
    const [currency, setCurrency] = useState('usd');

    const value = {
        currency,
        setCurrency,
        symbol: currencySymbols[currency] || '$'
    };

    return (
        <CurrencyContext.Provider value={value}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
}
