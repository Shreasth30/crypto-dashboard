import { useState, useEffect, useRef } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SearchBar({ data, onSelectCoin }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);
    const { symbol } = useCurrency();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const debounceId = setTimeout(() => {
            if (!query.trim()) {
                setResults([]);
                return;
            }
            const lowerQuery = query.toLowerCase();
            const filtered = data.filter(
                c => c.name.toLowerCase().includes(lowerQuery) || c.symbol.toLowerCase().includes(lowerQuery)
            ).slice(0, 5);
            setResults(filtered);
            setIsOpen(filtered.length > 0);
        }, 300);

        return () => clearTimeout(debounceId);
    }, [query, data]);

    const handleSelect = (coin) => {
        setQuery('');
        setIsOpen(false);
        if (onSelectCoin) onSelectCoin(coin.id);
    };

    return (
        <div ref={wrapperRef} className="relative w-full md:w-64 z-50">
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={16} className="text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => { if (results.length > 0) setIsOpen(true); }}
                    placeholder="Search coins..."
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all placeholder-slate-500"
                />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-12 left-0 right-0 glass-panel overflow-hidden py-2"
                    >
                        {results.map((coin) => (
                            <div
                                key={coin.id}
                                onClick={() => handleSelect(coin)}
                                className="flex items-center justify-between px-4 py-2 hover:bg-white/10 cursor-pointer transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <img src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full" />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">{coin.name}</span>
                                        <span className="text-xs text-slate-400 uppercase">{coin.symbol}</span>
                                    </div>
                                </div>
                                <span className="text-sm">{symbol}{coin.current_price.toLocaleString()}</span>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
