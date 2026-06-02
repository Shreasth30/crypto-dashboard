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
                <div className="glass-panel p-3 text-xs border-white/10 shadow-lg">
                    <p className="text-slate-400 mb-1 font-numeric text-[10px]">{formatDate(payload[0].payload.time)}</p>
                    <p className="font-bold text-sm font-numeric text-cyan-300">
                        {symbol}{payload[0].value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>
            );
        }
        return null;
    };

    const isPositive = coin.price_change_percentage_24h >= 0;
    const color = isPositive ? '#10b981' : '#f43f5e'; // emerald-500 : rose-500

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="glass-panel w-full max-w-4xl max-h-[92vh] overflow-y-auto relative z-10 flex flex-col border-white/15"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-slate-900/80 backdrop-blur-md z-20">
                        <div className="flex items-center gap-4">
                            <img src={coin.image} alt={coin.name} className="w-10 h-10 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.25)]" />
                            <div>
                                <h2 className="text-xl font-bold flex items-center gap-2 text-slate-100">
                                    {coin.name} <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-800/80 border border-slate-700 px-2 py-0.5 rounded font-numeric tracking-wider">{coin.symbol}</span>
                                </h2>
                                <div className="flex items-center gap-3 mt-1.5">
                                    <span className="text-lg font-bold font-numeric text-slate-200">{symbol}{coin.current_price.toLocaleString()}</span>
                                    <span className={`flex items-center text-xs font-bold px-2 py-0.5 rounded border ${isPositive ? 'text-emerald-400 bg-emerald-400/10 border-emerald-500/20' : 'text-rose-400 bg-rose-400/10 border-rose-500/20'}`}>
                                        {isPositive ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
                                        {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all focus:outline-none cursor-pointer"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Chart Area */}
                    <div className="p-6 flex-grow flex flex-col min-h-[360px] border-b border-white/5">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider font-numeric">Price Performance</h3>
                            <div className="flex bg-slate-900/60 rounded-xl p-1 border border-white/5 font-numeric">
                                {timeframes.map((tf) => (
                                    <button
                                        key={tf.value}
                                        onClick={() => setDays(tf.value)}
                                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${days === tf.value ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                                    >
                                        {tf.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="w-full relative h-[250px] min-h-[250px]">
                            {loading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-950/20 backdrop-blur-xs z-10 rounded-xl">
                                    <Loader2 className="animate-spin text-cyan-400" size={32} />
                                </div>
                            )}
                            {error && (
                                <div className="absolute inset-0 flex items-center justify-center z-10">
                                    <p className="text-cyan-500 bg-cyan-500/10 px-4 py-2 rounded-lg border border-cyan-500/20 font-semibold">{error}</p>
                                </div>
                            )}
                            {!error && historyData.length > 0 && (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={historyData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={color} stopOpacity={0.25} />
                                                <stop offset="95%" stopColor={color} stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis
                                            dataKey="time"
                                            domain={['dataMin', 'dataMax']}
                                            type="number"
                                            tickFormatter={formatDate}
                                            minTickGap={60}
                                            stroke="#334155"
                                            tick={{ fill: '#64748b', fontSize: 10, fontWeight: '600' }}
                                            axisLine={false}
                                            tickLine={false}
                                            dy={10}
                                        />
                                        <YAxis
                                            domain={['auto', 'auto']}
                                            tickFormatter={(val) => `${symbol}${val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val}`}
                                            stroke="#334155"
                                            tick={{ fill: '#64748b', fontSize: 10, fontWeight: '600' }}
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

                    {/* Stats Grid */}
                    <div className="p-6 bg-slate-950/20 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-slate-900/40 border border-white/5 p-4 rounded-2xl">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">24h High</span>
                            <span className="text-sm font-bold font-numeric text-slate-100 block mt-1.5">
                                {symbol}{coin.high_24h?.toLocaleString() || 'N/A'}
                            </span>
                        </div>
                        <div className="bg-slate-900/40 border border-white/5 p-4 rounded-2xl">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">24h Low</span>
                            <span className="text-sm font-bold font-numeric text-slate-100 block mt-1.5">
                                {symbol}{coin.low_24h?.toLocaleString() || 'N/A'}
                            </span>
                        </div>
                        <div className="bg-slate-900/40 border border-white/5 p-4 rounded-2xl">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">24h Volume</span>
                            <span className="text-sm font-bold font-numeric text-slate-100 block mt-1.5">
                                {symbol}{coin.total_volume?.toLocaleString() || 'N/A'}
                            </span>
                        </div>
                        <div className="bg-slate-900/40 border border-white/5 p-4 rounded-2xl">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Market Cap Rank</span>
                            <span className="text-sm font-bold font-numeric text-slate-100 block mt-1.5">
                                #{coin.market_cap_rank || 'N/A'}
                            </span>
                        </div>
                        <div className="bg-slate-900/40 border border-white/5 p-4 rounded-2xl">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">All-Time High</span>
                            <span className="text-sm font-bold font-numeric text-slate-100 block mt-1.5">
                                {symbol}{coin.ath?.toLocaleString() || 'N/A'}
                            </span>
                            <span className={`text-[9px] font-bold mt-1 block font-numeric ${coin.ath_change_percentage >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {coin.ath_change_percentage?.toFixed(2)}% from peak
                            </span>
                        </div>
                        <div className="bg-slate-900/40 border border-white/5 p-4 rounded-2xl">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">All-Time Low</span>
                            <span className="text-sm font-bold font-numeric text-slate-100 block mt-1.5">
                                {symbol}{coin.atl?.toLocaleString() || 'N/A'}
                            </span>
                            <span className={`text-[9px] font-bold mt-1 block font-numeric ${coin.atl_change_percentage >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {coin.atl_change_percentage >= 0 ? '+' : ''}{coin.atl_change_percentage?.toFixed(2)}% from floor
                            </span>
                        </div>
                        <div className="bg-slate-900/40 border border-white/5 p-4 rounded-2xl col-span-1 md:col-span-2">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Circulating / Total Supply</span>
                            <div className="flex items-baseline gap-2 mt-1.5 font-numeric text-xs font-medium">
                                <span className="text-sm font-bold text-slate-100">
                                    {coin.circulating_supply?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                </span>
                                <span className="text-slate-500">/</span>
                                <span className="text-slate-400">
                                    {coin.total_supply ? coin.total_supply.toLocaleString(undefined, { maximumFractionDigits: 0 }) : '∞'}
                                </span>
                                <span className="text-[10px] text-slate-500 uppercase font-bold">{coin.symbol}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
