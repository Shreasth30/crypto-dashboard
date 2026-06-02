import { TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StatsPanel({ data }) {
    if (!data || data.length === 0) return null;

    // Clone array to sort without mutating original
    const sortedByChange = [...data].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);

    const topGainer = sortedByChange[0];
    const topLoser = sortedByChange[sortedByChange.length - 1];

    // Compute Market Health Score
    const averageChange = data.reduce((acc, coin) => acc + (coin.price_change_percentage_24h || 0), 0) / data.length;
    const score = Math.max(0, Math.min(100, Math.round(((averageChange + 6) / 12) * 100))); // Scaled between -6% and +6%

    let healthLabel = "Neutral";
    let healthColor = "text-yellow-400";
    let healthBg = "bg-yellow-400/10";
    let healthBorder = "border-yellow-400/20";

    if (score < 25) {
        healthLabel = "Extreme Fear";
        healthColor = "text-rose-500";
        healthBg = "bg-rose-500/10";
        healthBorder = "border-rose-500/20";
    } else if (score < 45) {
        healthLabel = "Fear";
        healthColor = "text-orange-400";
        healthBg = "bg-orange-400/10";
        healthBorder = "border-orange-400/20";
    } else if (score > 75) {
        healthLabel = "Extreme Greed";
        healthColor = "text-cyan-400";
        healthBg = "bg-cyan-400/10";
        healthBorder = "border-cyan-400/20";
    } else if (score > 55) {
        healthLabel = "Greed";
        healthColor = "text-emerald-400";
        healthBg = "bg-emerald-400/10";
        healthBorder = "border-emerald-400/20";
    }

    const strokeWidth = 6;
    const radius = 30;
    const circumference = Math.PI * radius; // 94.24
    const strokeDashoffset = circumference - (score / 100) * circumference;

    const variants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full">
            {/* Top Gainer */}
            <motion.div
                variants={variants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.1, duration: 0.4 }}
                className="glass-panel-interactive p-5 flex items-center justify-between border-emerald-500/10 hover:border-emerald-500/30 hover:shadow-[0_0_20px_rgba(52,211,153,0.1)] relative overflow-hidden group"
            >
                <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-all duration-300"></div>
                <div className="flex flex-col gap-3 z-10">
                    <span className="text-[10px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-md border border-emerald-500/15 font-semibold uppercase tracking-wider w-fit font-numeric">
                        Top Gainer
                    </span>
                    <div className="flex items-center gap-3">
                        <img src={topGainer.image} alt={topGainer.name} className="w-9 h-9 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.05)]" />
                        <div>
                            <h3 className="text-sm font-bold text-slate-100">{topGainer.name}</h3>
                            <span className="text-[10px] text-slate-400 font-bold uppercase font-numeric">{topGainer.symbol}</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1 z-10">
                    <div className="flex items-center gap-1 text-emerald-400 font-numeric text-sm font-semibold">
                        <TrendingUp size={16} />
                        <span>+{topGainer.price_change_percentage_24h?.toFixed(2)}%</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-numeric font-medium">In 24 hours</span>
                </div>
            </motion.div>

            {/* Market Health Gauge */}
            <motion.div
                variants={variants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2, duration: 0.4 }}
                className="glass-panel p-5 flex items-center justify-between border-cyan-500/10 relative overflow-hidden"
            >
                <div className="flex flex-col gap-1 w-[55%] z-10">
                    <span className="text-[10px] text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded-md border border-cyan-500/15 font-semibold uppercase tracking-wider w-fit font-numeric">
                        Market Sentiment
                    </span>
                    <h3 className="text-xs font-bold text-slate-100 mt-2 flex items-center gap-1">
                        Index: <span className="font-numeric text-sm text-cyan-300 font-bold">{score}</span>/100
                    </h3>
                    <div className={`mt-2 text-[10px] font-bold px-2 py-0.5 rounded-md border w-fit ${healthColor} ${healthBg} ${healthBorder} tracking-wide uppercase font-numeric`}>
                        {healthLabel}
                    </div>
                </div>
                <div className="w-[40%] flex justify-center items-center relative overflow-visible mt-2">
                    <div className="absolute top-[28px] text-center">
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Health</span>
                    </div>
                    <svg width="85" height="52" viewBox="0 0 80 50" className="overflow-visible">
                        <defs>
                            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#f43f5e" /> {/* rose-500 */}
                                <stop offset="50%" stopColor="#eab308" /> {/* yellow-500 */}
                                <stop offset="100%" stopColor="#06b6d4" /> {/* cyan-500 */}
                            </linearGradient>
                        </defs>
                        {/* Background track */}
                        <path
                            d="M 15,42 A 25,25 0 0,1 65,42"
                            fill="none"
                            stroke="rgba(255,255,255,0.06)"
                            strokeWidth={strokeWidth}
                            strokeLinecap="round"
                        />
                        {/* Fill gauge */}
                        <path
                            d="M 15,42 A 25,25 0 0,1 65,42"
                            fill="none"
                            stroke="url(#gaugeGradient)"
                            strokeWidth={strokeWidth}
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                        />
                    </svg>
                </div>
            </motion.div>

            {/* Top Loser */}
            <motion.div
                variants={variants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.3, duration: 0.4 }}
                className="glass-panel-interactive p-5 flex items-center justify-between border-rose-500/10 hover:border-rose-500/30 hover:shadow-[0_0_20px_rgba(244,63,94,0.08)] relative overflow-hidden group"
            >
                <div className="absolute right-0 top-0 w-24 h-24 bg-rose-500/5 rounded-full blur-xl group-hover:bg-rose-500/10 transition-all duration-300"></div>
                <div className="flex flex-col gap-3 z-10">
                    <span className="text-[10px] text-rose-400 bg-rose-400/10 px-2 py-0.5 rounded-md border border-rose-500/15 font-semibold uppercase tracking-wider w-fit font-numeric">
                        Top Loser
                    </span>
                    <div className="flex items-center gap-3">
                        <img src={topLoser.image} alt={topLoser.name} className="w-9 h-9 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.05)]" />
                        <div>
                            <h3 className="text-sm font-bold text-slate-100">{topLoser.name}</h3>
                            <span className="text-[10px] text-slate-400 font-bold uppercase font-numeric">{topLoser.symbol}</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1 z-10">
                    <div className="flex items-center gap-1 text-rose-400 font-numeric text-sm font-semibold">
                        <TrendingDown size={16} />
                        <span>{topLoser.price_change_percentage_24h?.toFixed(2)}%</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-numeric font-medium">In 24 hours</span>
                </div>
            </motion.div>
        </div>
    );
}
