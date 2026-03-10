import { useCurrency } from '../context/CurrencyContext';
import { useWatchlist } from '../hooks/useWatchlist';
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

export default function CoinTable({ data, onSelectCoin }) {
    const { symbol } = useCurrency();
    const { isFavorite, toggleCoin } = useWatchlist();

    if (!data || data.length === 0) return null;

    return (
        <div className="glass-panel overflow-hidden w-full">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider border-b border-white/5">
                            <th className="p-4 font-semibold w-12 text-center">#</th>
                            <th className="p-4 font-semibold">Asset</th>
                            <th className="p-4 font-semibold text-right">Price</th>
                            <th className="p-4 font-semibold text-right">24h Change</th>
                            <th className="p-4 font-semibold text-right">Market Cap</th>
                            <th className="p-4 font-semibold text-center w-32">Last 7 Days</th>
                            <th className="p-4 font-semibold text-center w-16"></th>
                        </tr>
                    </thead>
                    <motion.tbody
                        variants={tableVariants}
                        initial="hidden"
                        animate="visible"
                        className="text-sm"
                    >
                        {data.map((coin) => {
                            const flashedUp = coin._flash === 'up';
                            const flashedDown = coin._flash === 'down';
                            const flashColor = flashedUp ? 'rgba(52, 211, 153, 0.2)' : flashedDown ? 'rgba(251, 113, 133,  0.2)' : 'transparent';

                            return (
                                <motion.tr
                                    key={coin.id}
                                    variants={rowVariants}
                                    onClick={() => onSelectCoin && onSelectCoin(coin.id)}
                                    className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer"
                                >
                                    <td className="p-4 text-center text-slate-500 font-medium">
                                        {coin.market_cap_rank}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
                                            <div>
                                                <p className="font-bold text-slate-100">{coin.name}</p>
                                                <p className="text-xs font-medium text-slate-400 uppercase">{coin.symbol}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right font-medium">
                                        <motion.div
                                            key={coin.current_price} // Triggers animation when price changes
                                            initial={{ backgroundColor: flashColor }}
                                            animate={{ backgroundColor: 'transparent' }}
                                            transition={{ duration: 1.5, ease: 'easeOut' }}
                                            className="inline-block px-2 py-1 rounded"
                                        >
                                            {symbol}{coin.current_price.toLocaleString()}
                                        </motion.div>
                                    </td>
                                    <td className="p-4 text-right font-medium">
                                        <span className={coin.price_change_percentage_24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                                            {coin.price_change_percentage_24h > 0 ? '+' : ''}
                                            {coin.price_change_percentage_24h?.toFixed(2)}%
                                        </span>
                                    </td>
                                    <td className="p-4 text-right text-slate-300">
                                        {symbol}{coin.market_cap.toLocaleString()}
                                    </td>
                                    <td className="p-4 w-32">
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
                                            className="text-slate-500 hover:text-yellow-400 transition-colors focus:outline-none"
                                        >
                                            <Star
                                                size={20}
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
