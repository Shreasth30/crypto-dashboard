import { useCurrency } from '../context/CurrencyContext';
import Sparkline from './Sparkline';
import { Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const tableVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05 }
    }
};

const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
};

const getAssetCategory = (symbol) => {
    const sym = symbol?.toLowerCase();
    if (['btc', 'eth'].includes(sym)) return { label: 'Blue Chip', className: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/15' };
    if (['usdt', 'usdc'].includes(sym)) return { label: 'Stablecoin', className: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/15' };
    if (['doge', 'shib', 'pepe', 'bonk', 'floki', 'wif'].includes(sym)) return { label: 'Meme', className: 'text-amber-400 bg-amber-500/10 border-amber-500/15' };
    if (['sol', 'ada', 'avax', 'dot', 'near', 'trx', 'ton', 'sui', 'apt'].includes(sym)) return { label: 'L1 Chain', className: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/15' };
    if (['link', 'uni', 'aave', 'grt', 'mkr', 'ldo'].includes(sym)) return { label: 'DeFi', className: 'text-pink-400 bg-pink-500/10 border-pink-500/15' };
    return { label: 'Utility', className: 'text-slate-400 bg-slate-500/10 border-slate-500/15' };
};

export default function CoinTable({ data, onSelectCoin, toggleCoin, isFavorite }) {
    const { symbol } = useCurrency();

    if (!data || data.length === 0) return null;

    return (
        <div className="glass-panel overflow-hidden w-full border-white/10">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="bg-slate-800/40 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-white/5 font-numeric">
                            <th className="p-4 w-12 text-center">#</th>
                            <th className="p-4">Asset</th>
                            <th className="p-4 text-right">Price</th>
                            <th className="p-4 text-right">24h Change</th>
                            <th className="p-4 text-right">Market Cap</th>
                            <th className="p-4 text-center w-32">Last 7 Days</th>
                            <th className="p-4 text-center w-16"></th>
                        </tr>
                    </thead>
                    <motion.tbody
                        variants={tableVariants}
                        initial="hidden"
                        animate="visible"
                        className="text-xs"
                    >
                        {data.map((coin) => {
                            const flashedUp = coin._flash === 'up';
                            const flashedDown = coin._flash === 'down';
                            const flashColor = flashedUp ? 'rgba(52, 211, 153, 0.25)' : flashedDown ? 'rgba(251, 113, 133, 0.25)' : 'transparent';

                            return (
                                <motion.tr
                                    key={coin.id}
                                    variants={rowVariants}
                                    onClick={() => onSelectCoin && onSelectCoin(coin.id)}
                                    className="border-b border-white/5 hover:bg-white/5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] transition-colors group cursor-pointer"
                                >
                                    <td className="p-4 text-center font-numeric text-[10px] font-bold text-slate-500">
                                        <span className="bg-slate-800/40 border border-slate-700/30 px-2 py-0.5 rounded text-[10px] text-slate-400 font-bold">
                                            {coin.market_cap_rank}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3.5">
                                            <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.2)]" />
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-bold text-slate-100 text-sm tracking-tight">{coin.name}</p>
                                                    {(() => {
                                                        const cat = getAssetCategory(coin.symbol);
                                                        return (
                                                            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${cat.className} uppercase tracking-wider scale-95 origin-left`}>
                                                                {cat.label}
                                                            </span>
                                                        );
                                                    })()}
                                                </div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase font-numeric tracking-wider mt-0.5">{coin.symbol}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right font-numeric font-bold text-slate-100 text-sm">
                                        <motion.div
                                            key={coin.current_price}
                                            initial={{ backgroundColor: flashColor }}
                                            animate={{ backgroundColor: 'transparent' }}
                                            transition={{ duration: 1.5, ease: 'easeOut' }}
                                            className="inline-block px-1.5 py-0.5 rounded"
                                        >
                                            {symbol}{coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                                        </motion.div>
                                    </td>
                                    <td className="p-4 text-right font-numeric font-semibold text-xs">
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border font-bold ${coin.price_change_percentage_24h >= 0 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-rose-400 bg-rose-500/10 border-rose-500/20'}`}>
                                            {coin.price_change_percentage_24h > 0 ? '+' : ''}
                                            {coin.price_change_percentage_24h?.toFixed(2)}%
                                        </span>
                                    </td>
                                    <td className="p-4 text-right text-slate-300 font-numeric text-sm font-semibold">
                                        {symbol}{coin.market_cap.toLocaleString()}
                                    </td>
                                    <td className="p-4 w-32 flex justify-center">
                                        <Sparkline
                                            data={coin.sparkline_in_7d?.price}
                                            isPositive={coin.price_change_percentage_24h >= 0}
                                        />
                                    </td>
                                    <td className="p-4 text-center">
                                        <motion.button
                                            whileTap={{ scale: 1.5 }}
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleCoin(coin.id);
                                            }}
                                            className="text-slate-500 hover:text-yellow-400 transition-colors focus:outline-none cursor-pointer"
                                        >
                                            <Star
                                                size={18}
                                                className={isFavorite(coin.id) ? 'fill-yellow-400 text-yellow-400' : ''}
                                            />
                                        </motion.button>
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </motion.tbody>
                </table>
            </div>
        </div>
    );
}
