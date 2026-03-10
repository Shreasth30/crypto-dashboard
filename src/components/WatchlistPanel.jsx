import { useWatchlist } from '../hooks/useWatchlist';
import { useCurrency } from '../context/CurrencyContext';
import { Star, TrendingUp, TrendingDown, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WatchlistPanel({ data }) {
    const { watchlist, toggleCoin } = useWatchlist();
    const { symbol } = useCurrency();

    const watchlistData = data.filter(coin => watchlist.includes(coin.id));

    if (watchlistData.length === 0) {
        return (
            <div className="glass-panel p-6 text-center text-slate-400">
                <Star size={32} className="mx-auto mb-3 opacity-20" />
                <h3 className="font-semibold mb-1">No saved coins</h3>
                <p className="text-sm">Click the star icon to add assets to your watchlist.</p>
            </div>
        );
    }

    return (
        <div className="glass-panel overflow-hidden">
            <div className="p-4 border-b border-white/5 bg-slate-800/30 flex items-center gap-2">
                <Star size={18} className="text-yellow-400 fill-yellow-400" />
                <h2 className="font-bold">My Watchlist</h2>
            </div>
            <div className="p-2 space-y-1">
                <AnimatePresence>
                    {watchlistData.map((coin) => (
                        <motion.div
                            key={coin.id}
                            initial={{ opacity: 0, height: 0, scale: 0.9 }}
                            animate={{ opacity: 1, height: 'auto', scale: 1 }}
                            exit={{ opacity: 0, height: 0, scale: 0.9, marginBottom: 0, overflow: 'hidden' }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
                                <div className="flex flex-col">
                                    <span className="font-bold text-sm leading-none">{coin.symbol.toUpperCase()}</span>
                                    <span className="text-xs text-slate-400 mt-1">{coin.name}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right flex flex-col items-end">
                                    <span className="font-medium text-sm leading-none">{symbol}{coin.current_price.toLocaleString()}</span>
                                    <span className={`text-xs mt-1 flex items-center gap-0.5 ${coin.price_change_percentage_24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {coin.price_change_percentage_24h >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                        {Math.abs(coin.price_change_percentage_24h)?.toFixed(2)}%
                                    </span>
                                </div>
                                <button
                                    onClick={() => toggleCoin(coin.id)}
                                    className="p-1.5 text-slate-600 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                    title="Remove from watchlist"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
