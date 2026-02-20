import React, { useState } from 'react';
import { Mail, Lock, Zap, ArrowRight, Fingerprint, Sparkles, Loader2, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

export const AuthView = ({ onAuthenticate }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!email.includes('@')) {
            setError('Please use a valid neural-linked email.');
            return;
        }

        setIsLoading(true);
        // Simulate bio-verification & neural sync
        setTimeout(() => {
            setIsLoading(false);
            onAuthenticate({ email });
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Ambient Background Elements */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[120px] animate-morphing" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[100px] animate-pulse" />

            <div className="w-full max-w-md relative z-10">
                {/* Branding */}
                <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="inline-flex items-center justify-center p-4 tactile rounded-[2rem] text-primary mb-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
                        <Globe size={32} className="animate-spin-slow" />
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white mb-2 kinetic-text">
                        LexiPath <span className="text-primary italic">2026</span>
                    </h1>
                    <p className="text-slate-400 font-medium uppercase tracking-[0.3em] text-[10px]">
                        Cognitive Enrichment Protocol
                    </p>
                </div>

                {/* Auth Card */}
                <div className="glass p-10 rounded-[3rem] tactile border-white/40 shadow-2xl relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-30 transition-opacity">
                        <Sparkles size={40} className="text-primary animate-pulse" />
                    </div>

                    <div className="flex gap-8 mb-10 border-b border-slate-100 dark:border-slate-800 pb-2">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={cn(
                                "text-xs font-black uppercase tracking-widest pb-4 transition-all relative",
                                isLogin ? "text-primary" : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            Sign In
                            {isLogin && <div className="absolute bottom-[-1px] left-0 right-0 h-1 bg-primary rounded-full animate-in zoom-in-y" />}
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={cn(
                                "text-xs font-black uppercase tracking-widest pb-4 transition-all relative",
                                !isLogin ? "text-primary" : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            Register
                            {!isLogin && <div className="absolute bottom-[-1px] left-0 right-0 h-1 bg-primary rounded-full animate-in zoom-in-y" />}
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Neural Identity (Email)</label>
                            <div className="relative">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input
                                    type="email"
                                    required
                                    placeholder="yourname@neural.net"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-14 pr-6 py-5 bg-white/50 dark:bg-slate-800/30 rounded-[1.5rem] border-none outline-none focus:ring-4 ring-primary/10 transition-all font-bold text-slate-700 dark:text-slate-200 placeholder:text-slate-300"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Secure Cipher</label>
                            <div className="relative">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-14 pr-6 py-5 bg-white/50 dark:bg-slate-800/30 rounded-[1.5rem] border-none outline-none focus:ring-4 ring-primary/10 transition-all font-bold text-slate-700 dark:text-slate-200"
                                />
                            </div>
                        </div>

                        {error && (
                            <p className="text-[10px] font-black uppercase tracking-widest text-accent bg-accent/5 p-4 rounded-2xl border border-accent/10 animate-in shake">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-6 bg-primary text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] shadow-tactile animate-squishy hover:rotate-1 active:scale-95 transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
                        >
                            {isLoading ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <>
                                    {isLogin ? "Initiate Neural Session" : "Establish Protocol"}
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-slate-50 dark:border-slate-800 text-center">
                        <button className="inline-flex items-center gap-2 text-slate-300 hover:text-primary transition-colors group">
                            <Fingerprint size={24} className="group-hover:scale-110 transition-transform" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Bio-Unlock Simulation</span>
                        </button>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">
                        © 2026 ANTIGRAVITY COGNITION
                    </p>
                </div>
            </div>
        </div>
    );
};
