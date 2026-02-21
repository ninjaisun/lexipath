import React, { useState } from 'react';
import { Mail, Lock, Zap, ArrowRight, Fingerprint, Sparkles, Loader2, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LocalizationAgent } from './LocalizationAgent';

export const AuthView = ({ onAuthenticate, lang = 'zh' }) => {
    const t = LocalizationAgent.t(lang);
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
        <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col md:flex-row overflow-hidden font-sans">
            {/* Left Panel: Auth Form */}
            <div className="w-full md:w-[42%] flex flex-col justify-between p-12 lg:p-20 z-10 bg-white dark:bg-slate-950">
                <div className="animate-in fade-in slide-in-from-left duration-700">
                    <div className="flex items-center gap-3 mb-16">
                        <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                            <Globe size={24} />
                        </div>
                        <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">
                            LexiPath <span className="text-primary italic">2026</span>
                        </span>
                    </div>

                    <div className="max-w-md">
                        <h2 className="text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">
                            {isLogin ? t('auth.welcome') : t('auth.register_title')}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium mb-12 leading-relaxed">
                            {isLogin
                                ? t('auth.desc')
                                : t('auth.register_desc')}
                        </p>

                        <div className="flex gap-8 mb-10 border-b border-slate-100 dark:border-slate-900 pb-2">
                            <button
                                onClick={() => setIsLogin(true)}
                                className={cn(
                                    "text-xs font-black uppercase tracking-widest pb-4 transition-all relative",
                                    isLogin ? "text-primary" : "text-slate-400 hover:text-slate-600"
                                )}
                            >
                                {t('auth.sign_in')}
                                {isLogin && <div className="absolute bottom-[-1px] left-0 right-0 h-1 bg-primary rounded-full animate-in zoom-in-y" />}
                            </button>
                            <button
                                onClick={() => setIsLogin(false)}
                                className={cn(
                                    "text-xs font-black uppercase tracking-widest pb-4 transition-all relative",
                                    !isLogin ? "text-primary" : "text-slate-400 hover:text-slate-600"
                                )}
                            >
                                {t('auth.register')}
                                {!isLogin && <div className="absolute bottom-[-1px] left-0 right-0 h-1 bg-primary rounded-full animate-in zoom-in-y" />}
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">{t('auth.email')}</label>
                                <div className="relative">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                    <input
                                        type="email"
                                        required
                                        placeholder={t('auth.placeholder_email')}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 outline-none focus:ring-4 ring-primary/10 transition-all font-bold text-slate-700 dark:text-slate-200"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">{t('auth.password')}</label>
                                <div className="relative">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                    <input
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 outline-none focus:ring-4 ring-primary/10 transition-all font-bold text-slate-700 dark:text-slate-200"
                                    />
                                </div>
                            </div>

                            {error && (
                                <p className="text-[10px] font-black uppercase tracking-widest text-accent bg-accent/5 p-4 rounded-2xl border border-accent/10">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-6 bg-slate-950 dark:bg-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group disabled:opacity-50 shadow-xl"
                            >
                                {isLoading ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <>
                                        {isLogin ? t('auth.connect') : t('auth.register_action')}
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-10 pt-8 border-t border-slate-50 dark:border-slate-900 text-center md:text-left">
                            <button className="inline-flex items-center gap-2 text-slate-400 hover:text-primary transition-colors group">
                                <Fingerprint size={20} className="group-hover:scale-110 transition-transform" />
                                <span className="text-[9px] font-black uppercase tracking-widest">{t('auth.bio_unlock')}</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-slate-400">
                    <p className="text-[9px] font-black uppercase tracking-[0.4em]">
                        © 2026 ANTIGRAVITY COGNITION • PROTOCOL V1.4
                    </p>
                </div>
            </div>

            {/* Right Panel: Immersive Visuals */}
            <div className="hidden md:flex flex-1 relative bg-slate-950 items-center justify-center overflow-hidden">
                {/* Immersive Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-slate-950 to-accent/10 z-10" />
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center mix-blend-overlay opacity-60 scale-110 animate-pulse-slow" />

                    {/* Animated Grid Overlay */}
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '40px 40px' }} />
                </div>

                {/* Content Overlay */}
                <div className="relative z-20 max-w-lg p-12 animate-in fade-in zoom-in duration-1000">
                    <div className="glass p-12 rounded-[3.5rem] border-white/10 shadow-3xl backdrop-blur-2xl">
                        <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-8 text-primary shadow-inner">
                            <Zap size={32} />
                        </div>
                        <h3 className="text-4xl font-black text-white mb-6 uppercase tracking-tighter leading-none">
                            Precision <span className="text-primary italic">Cognition</span> is the new standard.
                        </h3>
                        <p className="text-slate-300 font-medium leading-relaxed text-lg mb-8">
                            {t('auth.immersion_desc')}
                        </p>
                        <div className="flex items-center gap-4 pt-8 border-t border-white/10">
                            <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/20 flex items-center justify-center text-xs font-black text-white italic">AI</div>
                            <div>
                                <p className="text-white text-xs font-bold uppercase tracking-widest">{t('auth.ai_assistant')}</p>
                                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">{t('auth.enrichment_active')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-20 right-20 w-32 h-32 bg-primary/30 rounded-full blur-[80px] animate-morphing" />
                <div className="absolute bottom-20 left-20 w-48 h-48 bg-accent/20 rounded-full blur-[100px] animate-pulse" />
            </div>
        </div>
    );
};
