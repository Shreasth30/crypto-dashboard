import { useCurrency } from '../context/CurrencyContext';
import { Star, TrendingUp, TrendingDown, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WatchlistPanel({ data, watchlist, toggleCoin }) {
    const { symbol } = useCurrency();

    const watchlistData = data.filter(coin => watchlist.includes(coin.id));

    if (watchlistData.length === 0) {
        return (
            <div className="glass-panel p-8 text-center border-dashed border-white/10 w-full">
                <div className="mx-auto w-12 h-12 rounded-full border border-dashed border-slate-700 flex items-center justify-center mb-4">
                    <Star size={20} className="text-slate-500" />
                </div>
                <h3 className="font-bold text-slate-200 text-sm mb-1">Watchlist Empty</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                    Click the star icon next to any asset to pin it here for quick tracking.
                </p>
            </div>
        );
    }

    return (
        <div className="glass-panel overflow-hidden border-white/10 w-full">
            <div className="p-4 border-b border-white/5 bg-slate-800/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Star size={16} className="text-yellow-400 fill-yellow-400" />
                    <h2 className="font-bold text-sm tracking-tight">Watchlist</h2>
                </div>
                <span className="bg-slate-700/50 text-[10px] text-slate-300 font-bold px-2 py-0.5 rounded-full font-numeric">
                    {watchlistData.length} {watchlistData.length === 1 ? 'Asset' : 'Assets'}
                </span>
            </div>
            <div className="p-2 space-y-1 max-h-[480px] overflow-y-auto">
                <AnimatePresence>
                    {watchlistData.map((coin) => (
                        <motion.div
                            key={coin.id}
                            initial={{ opacity: 0, height: 0, scale: 0.9 }}
                            animate={{ opacity: 1, height: 'auto', scale: 1 }}
                            exit={{ opacity: 0, height: 0, scale: 0.9, marginBottom: 0, overflow: 'hidden' }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/5"
                        >
                            <div className="flex items-center gap-3">
                                <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.15)]" />
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-1.5">
                                        <span className="font-bold text-xs uppercase leading-none text-slate-100">{coin.symbol}</span>
                                        <span className="bg-slate-800/60 border border-slate-700/40 text-[9px] font-bold text-slate-400 px-1 py-0.2 rounded font-numeric scale-90">
                                            #{coin.market_cap_rank}
                                        </span>
                                    </div>
                                    <span className="text-[10px] text-slate-400 mt-1 truncate max-w-[100px]">{coin.name}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-right flex flex-col items-end">
                                    <span className="font-bold text-xs leading-none text-slate-100 font-numeric">{symbol}{coin.current_price.toLocaleString()}</span>
                                    <span className={`text-[10px] mt-1.5 flex items-center gap-0.5 font-bold font-numeric ${coin.price_change_percentage_24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {coin.price_change_percentage_24h >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                        {Math.abs(coin.price_change_percentage_24h)?.toFixed(2)}%
                                    </span>
                                </div>
                                <button
                                    onClick={() => toggleCoin(coin.id)}
                                    className="p-1.5 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                                    title="Remove from watchlist"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
