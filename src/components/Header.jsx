import { useCurrency } from '../context/CurrencyContext';
import SearchBar from './SearchBar';
import { Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Header({ data, onSelectCoin }) {
    const { currency, setCurrency } = useCurrency();

    return (
        <motion.header
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="glass-panel sticky top-0 z-50 mb-8 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4"
        >
            <div className="flex items-center gap-3">
                <div className="bg-cyan-500/20 p-2 rounded-xl text-cyan-400">
                    <Activity size={28} />
                </div>
                <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                    CryptoDash
                </h1>
            </div>

            <div className="flex items-center gap-6 w-full md:w-auto">
                <SearchBar data={data} onSelectCoin={onSelectCoin} />

                <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all cursor-pointer hover:bg-slate-700/50"
                >
                    <option value="usd">USD ($)</option>
                    <option value="eur">EUR (€)</option>
                    <option value="inr">INR (₹)</option>
                </select>
            </div>
        </motion.header>
    );
}
