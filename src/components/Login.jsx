import { useState } from 'react';
import { Activity, Lock, Mail, ArrowRight, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login({ onLogin, onClose, isModal }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!email || !email.includes('@')) {
            setError('Please enter a valid email address.');
            return;
        }
        if (!password || password.length < 4) {
            setError('Password must be at least 4 characters.');
            return;
        }

        setLoading(true);
        setTimeout(() => {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', email);
            onLogin(email);
            setLoading(false);
        }, 800);
    };

    const modalContent = (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-full max-w-md glass-panel p-8 relative z-10 border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
        >
            {/* Close button */}
            {onClose && (
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-100 hover:bg-slate-800/40 transition-all cursor-pointer"
                    title="Close"
                >
                    <X size={16} />
                </button>
            )}

            {/* Brand Header */}
            <div className="flex flex-col items-center mb-8">
                <div className="bg-cyan-500/10 p-3 rounded-2xl text-cyan-500 mb-4 shadow-[0_8px_20px_rgba(6,182,212,0.1)] border border-cyan-500/20">
                    <Activity size={32} className="text-cyan-500 animate-[pulse_2s_infinite]" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-cyan-500 font-numeric">
                    CryptoDash
                </h1>
                <p className="text-xs text-slate-400 font-medium tracking-wide mt-1.5 uppercase font-numeric">
                    Institutional Crypto Terminal
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-rose-500/10 text-rose-500 text-xs font-semibold p-3.5 rounded-xl border border-rose-500/20"
                    >
                        {error}
                    </motion.div>
                )}

                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Email Address
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                            <Mail size={16} />
                        </div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@company.com"
                            className="w-full bg-slate-900/50 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all font-medium font-numeric"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Password
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                            <Lock size={16} />
                        </div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-slate-900/50 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all font-medium font-numeric"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
                >
                    {loading ? (
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        <>
                            Access Dashboard
                            <ArrowRight size={14} />
                        </>
                    )}
                </button>
            </form>

            {/* Footer Details */}
            <div className="mt-8 pt-6 border-t border-white/5 text-center">
                <p className="text-[10px] text-slate-400 leading-relaxed max-w-xs mx-auto">
                    This is a secure institutional access gateway. You can sign in using any valid email address to authenticate.
                </p>
            </div>
        </motion.div>
    );

    if (isModal) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
                {modalContent}
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-crypto-dark">
            <div className="glowing-orb-1"></div>
            <div className="glowing-orb-2"></div>
            {modalContent}
        </div>
    );
}
