import { TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StatsPanel({ data }) {
    if (!data || data.length === 0) return null;

    // Clone array to sort without mutating original
    const sortedByChange = [...data].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);

    const topGainer = sortedByChange[0];
    const topLoser = sortedByChange[sortedByChange.length - 1];

    const variants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1 }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <motion.div
                variants={variants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.1, duration: 0.4 }}
                className="glass-panel-interactive p-6 flex items-center justify-between"
            >
                <div>
                    <p className="text-sm text-slate-400 font-medium mb-1">Top Gainer (24h)</p>
                    <div className="flex items-center gap-3">
                        <img src={topGainer.image} alt={topGainer.name} className="w-8 h-8 rounded-full" />
                        <h3 className="text-xl font-bold">{topGainer.name}</h3>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full">
                        <TrendingUp size={16} />
                        <span className="font-semibold">+{topGainer.price_change_percentage_24h?.toFixed(2)}%</span>
                    </div>
                </div>
            </motion.div>

            <motion.div
                variants={variants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2, duration: 0.4 }}
                className="glass-panel-interactive p-6 flex items-center justify-between"
            >
                <div>
                    <p className="text-sm text-slate-400 font-medium mb-1">Top Loser (24h)</p>
                    <div className="flex items-center gap-3">
                        <img src={topLoser.image} alt={topLoser.name} className="w-8 h-8 rounded-full" />
                        <h3 className="text-xl font-bold">{topLoser.name}</h3>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1 text-rose-400 bg-rose-400/10 px-3 py-1 rounded-full">
                        <TrendingDown size={16} />
                        <span className="font-semibold">{topLoser.price_change_percentage_24h?.toFixed(2)}%</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
