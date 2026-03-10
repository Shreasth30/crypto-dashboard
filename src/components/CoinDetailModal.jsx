import { useState } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { useCoinHistory } from '../hooks/useCoinHistory';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { X, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const timeframes = [
    { label: '7D', value: '7' },
    { label: '1M', value: '30' },
    { label: '1Y', value: '365' }
];

export default function CoinDetailModal({ coinId, data: allData, onClose }) {
    const { currency, symbol } = useCurrency();
    const [days, setDays] = useState('7');

    const coin = allData?.find(c => c.id === coinId);
    const sparklineData = coin?.sparkline_in_7d?.price;
    const { data: historyData, loading, error } = useCoinHistory(coinId, currency, days, sparklineData);

    if (!coinId || !coin) return null;

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        if (days === '7') {
            return date.toLocaleDateString(undefined, { weekday: 'short', hour: 'numeric' });
        }
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: days > 365 ? 'numeric' : undefined });
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="glass-panel p-3 text-sm">
                    <p className="text-slate-400 mb-1">{formatDate(payload[0].payload.time)}</p>
                    <p className="font-bold text-lg">{symbol}{payload[0].value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</p>
                </div>
            );
        }
        return null;
    };

    const isPositive = coin.price_change_percentage_24h >= 0;
    const color = isPositive ? '#34d399' : '#fb7185';

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="glass-panel w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-10 flex flex-col"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-slate-900/80 backdrop-blur-md z-20">
                        <div className="flex items-center gap-4">
                            <img src={coin.image} alt={coin.name} className="w-10 h-10 rounded-full" />
                            <div>
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    {coin.name} <span className="text-sm font-medium text-slate-400 uppercase bg-slate-800 px-2 py-0.5 rounded">{coin.symbol}</span>
                                </h2>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-xl font-semibold">{symbol}{coin.current_price.toLocaleString()}</span>
                                    <span className={`flex items-center text-sm font-medium px-2 py-0.5 rounded flex-shrink-0 ${isPositive ? 'text-emerald-400 bg-emerald-400/10' : 'text-rose-400 bg-rose-400/10'}`}>
                                        {isPositive ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
                                        {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors focus:outline-none"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Chart Area */}
                    <div className="p-6 flex-grow flex flex-col min-h-[400px]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-semibold text-slate-300">Price History</h3>
                            <div className="flex bg-slate-800/50 rounded-lg p-1 border border-white/5">
                                {timeframes.map((tf) => (
                                    <button
                                        key={tf.value}
                                        onClick={() => setDays(tf.value)}
                                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${days === tf.value ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                                    >
                                        {tf.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="w-full relative h-[300px] min-h-[300px]">
                            {loading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/20 backdrop-blur-xs z-10 rounded-xl">
                                    <Loader2 className="animate-spin text-cyan-400" size={32} />
                                </div>
                            )}
                            {error && (
                                <div className="absolute inset-0 flex items-center justify-center z-10">
                                    <p className="text-rose-400 bg-rose-400/10 px-4 py-2 rounded-lg border border-rose-400/20">{error}</p>
                                </div>
                            )}
                            {!error && historyData.length > 0 && (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={historyData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                                <stop offset="95%" stopColor={color} stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis
                                            dataKey="time"
                                            domain={['dataMin', 'dataMax']}
                                            type="number"
                                            tickFormatter={formatDate}
                                            minTickGap={50}
                                            stroke="#475569"
                                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                                            axisLine={false}
                                            tickLine={false}
                                            dy={10}
                                        />
                                        <YAxis
                                            domain={['auto', 'auto']}
                                            tickFormatter={(val) => `${symbol}${val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val}`}
                                            stroke="#475569"
                                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                                            axisLine={false}
                                            tickLine={false}
                                            dx={-10}
                                            orientation="right"
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area
                                            type="monotone"
                                            dataKey="price"
                                            stroke={color}
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill="url(#colorPrice)"
                                            isAnimationActive={true}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
