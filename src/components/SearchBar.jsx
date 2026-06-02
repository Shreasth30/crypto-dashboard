import { useState, useEffect, useRef } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SearchBar({ data, onSelectCoin }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);
    const inputRef = useRef(null);
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
        const handleKeyDown = (e) => {
            if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || e.key === '/') {
                if (document.activeElement !== inputRef.current) {
                    e.preventDefault();
                    inputRef.current?.focus();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
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
                    <Search size={14} className="text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => { if (results.length > 0) setIsOpen(true); }}
                    placeholder="Search assets..."
                    className="w-full bg-slate-900/50 border border-slate-700/80 rounded-xl pl-9 pr-12 py-1.5 text-xs focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all placeholder-slate-500 font-medium"
                />
                <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
                    <kbd className="hidden sm:inline-flex items-center gap-0.5 bg-slate-800/80 px-1.5 py-0.5 rounded text-[10px] font-semibold text-slate-400 border border-slate-700 font-numeric">
                        <span>/</span>
                    </kbd>
                </div>
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
                                className="flex items-center justify-between px-4 py-2 hover:bg-slate-800/60 cursor-pointer transition-colors"
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
