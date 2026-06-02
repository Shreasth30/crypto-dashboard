import { useCurrency } from '../context/CurrencyContext';
import SearchBar from './SearchBar';
import { Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Header({ data, onSelectCoin, user, onLogout, onLoginClick }) {
    const { currency, setCurrency } = useCurrency();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // initial check
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.header
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="sticky top-4 z-50 mb-8 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 rounded-2xl transition-all duration-300 glass-panel"
        >
            <div className="flex items-center gap-3">
                <div className="bg-cyan-500/20 p-2.5 rounded-xl text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                    <Activity size={24} className="animate-[pulse_2s_infinite]" />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-cyan-500">
                        CryptoDash
                    </h1>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase font-numeric">
                            Live Feed // {data?.length || 0} Assets
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                <SearchBar data={data} onSelectCoin={onSelectCoin} />

                <div className="relative">
                    <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="appearance-none bg-slate-900/60 border border-slate-700/80 rounded-xl pl-3 pr-8 py-2 text-xs font-semibold outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all cursor-pointer hover:bg-slate-800/80 hover:border-slate-600 uppercase font-numeric tracking-wide"
                    >
                        <option value="usd">USD ($)</option>
                        <option value="eur">EUR (€)</option>
                        <option value="inr">INR (₹)</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                {user ? (
                    <div className="flex items-center gap-2 bg-slate-900/40 border border-slate-700/80 px-3 py-1.5 rounded-xl">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider max-w-[100px] truncate font-numeric">
                            {user.split('@')[0]}
                        </span>
                        <button
                            onClick={onLogout}
                            className="p-1 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                            title="Log Out"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                            </svg>
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={onLoginClick}
                        className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-wider transition-all duration-200 shadow-md shadow-cyan-500/10 cursor-pointer flex items-center gap-1.5 font-numeric"
                    >
                        Log In
                    </button>
                )}
            </div>
        </motion.header>
    );
}
