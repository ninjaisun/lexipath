import React, { useState } from 'react';
import {
    Volume2, HelpCircle, CheckCircle, Eye, RefreshCw,
    Layers, List, Bookmark, Sparkles, Loader2, Search,
    ChevronLeft, Play, Info, Video, PlayCircle, RotateCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { EnrichmentAgent } from './EnrichmentAgent';
import { LocalizationAgent } from './LocalizationAgent';

/**
 * Shared Content Component for Word Details
 */
const YouGlishPlayer = ({ word, lang = 'zh' }) => {
    const t = LocalizationAgent.t(lang);
    const rootRef = React.useRef(null);
    const widgetRef = React.useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const [error, setError] = useState(null);
    const [showIframeFallback, setShowIframeFallback] = useState(false);
    const widgetId = "yg-widget-" + Math.random().toString(36).substr(2, 9);

    const openSearch = () => {
        window.open(`https://youglish.com/pronounce/${encodeURIComponent(word)}/english`, '_blank');
    };

    const handleStart = () => {
        setHasStarted(true);
        setIsLoading(true);
    };

    React.useEffect(() => {
        if (!hasStarted) return;

        let isMounted = true;
        let checkTimer;
        let timeoutTimer;

        // Reset state when word changes, but keep hasStarted
        setIsLoading(true);
        setError(null);
        setShowIframeFallback(false);

        const initWidget = () => {
            if (!isMounted || !window.YG || !window.YG.Widget || !rootRef.current) return;

            try {
                const container = document.createElement('div');
                container.id = widgetId;
                container.style.width = '100%';
                container.style.height = '100%';
                rootRef.current.innerHTML = '';
                rootRef.current.appendChild(container);

                widgetRef.current = new window.YG.Widget(widgetId, {
                    width: "100%",
                    components: 84, // caption + video + search
                    partner: "lexipath_2026",
                    events: {
                        'onFetchDone': (e) => {
                            if (!isMounted) return;
                            setIsLoading(false);
                            if (e && e.total_results === 0) {
                                setError(t('media.error'));
                            } else {
                                setError(null);
                            }
                        },
                        'onError': (e) => {
                            if (!isMounted) return;
                            console.warn("YouGlish API Error:", e);
                            setIsLoading(false);
                            setShowIframeFallback(true);
                        }
                    }
                });

                if (widgetRef.current && typeof widgetRef.current.fetch === 'function') {
                    widgetRef.current.fetch(word, "english");
                }
            } catch (err) {
                console.error("YouGlish Integration Crash:", err);
                if (isMounted) {
                    setIsLoading(false);
                    setShowIframeFallback(true);
                }
            }
        };

        const isLocal = window.location.hostname === 'localhost';

        timeoutTimer = setTimeout(() => {
            if (isMounted && isLoading && !showIframeFallback) {
                console.log("YouGlish Timeout - Triggering Iframe Fallback");
                setIsLoading(false);
                setShowIframeFallback(true);
            }
        }, isLocal ? 5000 : 12000);

        checkTimer = setInterval(() => {
            if (window.YG && window.YG.Widget && rootRef.current) {
                clearInterval(checkTimer);
                initWidget();
            }
        }, 500);

        return () => {
            isMounted = false;
            clearInterval(checkTimer);
            clearTimeout(timeoutTimer);
            if (rootRef.current) rootRef.current.innerHTML = '';
        };
    }, [word, hasStarted, lang]);

    // Reset interaction state if word changes significantly
    React.useEffect(() => {
        setHasStarted(false);
        setIsLoading(false);
        setError(null);
        setShowIframeFallback(false);
    }, [word]);

    if (!word) return null;

    return (
        <div className="relative rounded-[2rem] overflow-hidden border border-white/10 bg-black/40 z-10 min-h-[380px] flex items-center justify-center group/player shadow-2xl">
            {/* Background Branding */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                <Video size={180} />
            </div>

            {/* Interaction Gate */}
            {!hasStarted && (
                <div
                    onClick={handleStart}
                    className="absolute inset-0 z-40 bg-slate-900/60 backdrop-blur-[2px] flex flex-col items-center justify-center cursor-pointer group/gate hover:bg-slate-900/40 transition-all duration-500"
                >
                    <div className="w-20 h-20 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center group-hover/gate:scale-110 group-hover/gate:bg-primary transition-all duration-500 shadow-2xl shadow-primary/20">
                        <Play size={32} className="text-white fill-white ml-2" />
                    </div>
                    <div className="mt-6 flex flex-col items-center gap-1.5">
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white group-hover/gate:text-primary transition-colors text-center px-4">
                            {t('media.initialize')}
                        </span>
                        <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500">
                            {t('media.secure_conn')}
                        </span>
                    </div>
                </div>
            )}

            {isLoading && hasStarted && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-slate-900/95 z-30 animate-in fade-in duration-500">
                    <div className="relative">
                        <Loader2 size={40} className="animate-spin text-primary" />
                        <div className="absolute inset-0 blur-xl bg-primary/20 animate-pulse"></div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80">{t('media.syncing')}</span>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">{t('media.streaming')}</span>
                    </div>
                </div>
            )}

            {error && !showIframeFallback && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 bg-slate-900 z-30 p-12 text-center animate-in zoom-in-95 fade-in duration-500">
                    <div className="w-16 h-16 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                        <Video size={30} className="text-slate-500" />
                    </div>
                    <h5 className="text-white font-black uppercase text-xs tracking-widest">{error}</h5>
                    <button
                        onClick={openSearch}
                        className="group flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/30"
                    >
                        <PlayCircle size={16} /> {t('media.open_youglish')}
                    </button>
                </div>
            )}

            {showIframeFallback && (
                <div className="absolute inset-0 z-20 animate-in fade-in zoom-in-95 duration-1000">
                    <iframe
                        title="YouGlish Fallback"
                        src={`https://youglish.com/pronounce/${encodeURIComponent(word)}/english/all/emb=1&autoplay=1`}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                        className="w-full h-full rounded-[2rem]"
                        onLoad={() => setIsLoading(false)}
                    ></iframe>
                </div>
            )}

            {/* JS Widget Container */}
            <div
                ref={rootRef}
                className={cn(
                    "w-full h-full min-h-[380px] transition-all duration-1000",
                    (isLoading || error || showIframeFallback || !hasStarted) ? "opacity-0 blur-xl scale-95 invisible" : "opacity-100 blur-0 scale-100"
                )}
            ></div>
        </div>
    );
};

export const WordDetailContent = ({ item, onStatusChange, onWordUpdate, isEnriching: parentIsEnriching, onEnrich, lang = 'zh' }) => {
    const t = LocalizationAgent.t(lang);
    const [localIsEnriching, setLocalIsEnriching] = useState(false);
    const isEnriching = parentIsEnriching || localIsEnriching;

    const speak = (text) => {
        if (!text) return;
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    };

    const handleEnrich = async () => {
        if (onEnrich) {
            onEnrich();
        } else {
            setLocalIsEnriching(true);
            try {
                const enriched = await EnrichmentAgent.enrichWord(item);
                if (onWordUpdate) {
                    onWordUpdate(item.id, {
                        synonyms: enriched.synonyms,
                        examples: enriched.examples,
                        pronunciation: enriched.pronunciation,
                        meaning_en: enriched.meaning_en
                    });
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLocalIsEnriching(false);
            }
        }
    };

    const highlightWord = (sentence, word) => {
        if (!sentence || !word) return sentence;
        const parts = sentence.split(new RegExp(`(${word})`, 'gi'));
        return (
            <span>
                {parts.map((part, i) =>
                    part.toLowerCase() === word.toLowerCase()
                        ? <b key={i} className="text-primary font-black border-b-2 border-primary/20">{part}</b>
                        : part
                )}
            </span>
        );
    };

    const examples = Array.isArray(item.examples) ? item.examples : (item.example ? [item.example] : []);

    return (
        <div className="w-full space-y-10 text-left relative z-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {/* 1. Header Row (Full Width) */}
            <div className="w-full bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-[3rem] p-10 border border-white/20 shadow-inner-soft flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex flex-col items-center md:items-start gap-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full">
                        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-accent">
                            {t('detail.header_urgency', { urgency: t('detail.urgency_medium') })}
                        </span>
                    </div>

                    <div className="flex items-center gap-6">
                        <h2 className="text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-none kinetic-text">{item.word}</h2>
                        <button
                            onClick={() => speak(item.word)}
                            className="p-5 bg-white shadow-tactile text-primary rounded-[1.5rem] hover:bg-slate-50 transition-all active:scale-95 group"
                        >
                            <Volume2 size={28} className="group-hover:scale-110 transition-transform" />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col items-center md:items-end justify-center">
                    <p className="text-slate-400 font-mono text-3xl tracking-[0.4em] font-medium opacity-60">
                        {item.pronunciation || '/.../'}
                    </p>
                    <span className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-300 mt-2">
                        {t('detail.placeholder_pronunciation')}
                    </span>
                </div>
            </div>

            {/* 2. Split Workspace (Two Panels) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Panel: Related Information */}
                <div className="space-y-8 flex flex-col">
                    {/* Core Definition */}
                    <div className="p-10 tactile rounded-[3rem] border border-white/10 group bg-white/30 flex-1">
                        <h4 className="flex items-center gap-2 text-xs font-black uppercase text-primary mb-6 tracking-[0.2em] opacity-70">
                            <Sparkles size={14} /> {t('detail.definition')}
                        </h4>
                        <div className="space-y-4">
                            <p className="text-4xl font-black text-slate-900 dark:text-slate-100 leading-tight">
                                {item.meaning_cn}
                            </p>
                            <div className="h-px w-16 bg-primary/20" />
                            <p className="text-xl text-slate-500 font-medium leading-relaxed italic">
                                {item.meaning_en || (item.examples?.[0]?.meaning_en)}
                            </p>
                        </div>
                    </div>

                    {/* Social Context */}
                    <div className="p-8 glass rounded-[3rem] border border-white/20">
                        <h4 className="flex items-center gap-2 text-xs font-black uppercase text-accent mb-6 tracking-[0.2em]">
                            <List size={14} /> {t('detail.context')}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {['Professional Meetings', 'Academic Writing', 'Casual Debate'].map((context, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                    <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
                                        <Play size={16} fill="currentColor" />
                                    </div>
                                    <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest leading-none">
                                        {lang === 'zh' ? (i === 0 ? '职场会议' : i === 1 ? '学术写作' : '日常辩论') : context}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Synonyms & Examples Wrapper */}
                    <div className="grid grid-cols-1 gap-6">
                        {/* Synonyms */}
                        <div className="p-8 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-[2.5rem] border border-white/20 shadow-sm flex flex-col">
                            <h4 className="flex items-center gap-2 text-[11px] font-black uppercase text-slate-400 mb-4 tracking-widest">
                                <RefreshCw size={16} /> {t('detail.synonyms')}
                            </h4>
                            {item.synonyms ? (
                                <div className="flex flex-wrap gap-2">
                                    {item.synonyms.split(',').map((s, i) => (
                                        <span key={i} className="px-3 py-1 bg-white dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700 hover:border-primary/30 transition-colors cursor-default">
                                            {s.trim()}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-slate-300 dark:text-slate-700 gap-2 py-4">
                                    <Search size={22} strokeWidth={1.5} />
                                    <span className="text-[8px] uppercase font-black tracking-widest">{t('detail.ai_available')}</span>
                                </div>
                            )}
                        </div>

                        {/* Cinematic Usage */}
                        <div className="p-10 tactile rounded-[3rem] border border-white/10 space-y-6 bg-slate-50/50">
                            <h4 className="flex items-center gap-2 text-xs font-black uppercase text-slate-400 mb-2 tracking-widest">
                                <Video size={18} /> {t('detail.examples')}
                            </h4>
                            {examples.length > 0 ? (
                                <div className="space-y-6">
                                    {examples.slice(0, 2).map((ex, idx) => (
                                        <div key={idx} className="group relative pl-4 border-l-4 border-primary/20 hover:border-primary transition-all">
                                            <p className="text-lg text-slate-700 dark:text-slate-200 italic font-serif leading-relaxed font-medium">
                                                "{highlightWord(ex, item.word)}"
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 opacity-20 text-xs font-black uppercase tracking-widest">{t('detail.no_segments')}</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Panel: Media Engine & Actions */}
                <div className="space-y-8 flex flex-col">
                    {/* Media Engine (YouGlish) */}
                    <div className="p-8 bg-slate-900 rounded-[3rem] border border-white/10 shadow-tactile overflow-hidden relative group flex-1 flex flex-col">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                            <Video size={120} className="text-primary" />
                        </div>

                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 mb-6 tracking-widest relative z-10">
                            <PlayCircle size={18} className="text-primary" /> {t('detail.media')}
                        </h4>

                        <div className="flex-1 flex flex-col justify-center">
                            <YouGlishPlayer word={item.word} lang={lang} />
                        </div>

                        <p className="mt-6 text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center leading-relaxed">
                            {t('detail.media_desc', { word: item.word })}
                        </p>
                    </div>

                    {/* Achievement Protocol (Status) */}
                    {onStatusChange && (
                        <div className="p-4 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-[2.5rem] border border-white/20 shadow-inner-soft flex flex-col gap-4">
                            <h4 className="px-4 text-[9px] font-black uppercase text-slate-400 tracking-[0.3em]">
                                {t('detail.achievement_protocol')}
                            </h4>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => onStatusChange(item.id, 'unmastered')}
                                    className={cn(
                                        "flex-1 py-5 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3",
                                        item.status === 'unmastered'
                                            ? "bg-white dark:bg-slate-800 text-orange-600 shadow-tactile border border-orange-100 animate-squishy"
                                            : "text-slate-400 hover:bg-white/50"
                                    )}
                                >
                                    <HelpCircle size={18} /> {t('action.new_discovery')}
                                </button>
                                <button
                                    onClick={() => onStatusChange(item.id, 'mastered')}
                                    className={cn(
                                        "flex-1 py-5 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3",
                                        item.status === 'mastered'
                                            ? "bg-white dark:bg-slate-800 text-primary shadow-tactile border border-primary/10 animate-squishy"
                                            : "text-slate-400 hover:bg-white/50"
                                    )}
                                >
                                    <CheckCircle size={18} /> {t('action.mastery_achieved')}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* AI Augmentation Trigger */}
                    <div className="p-2">
                        <button
                            onClick={handleEnrich}
                            disabled={isEnriching}
                            className="w-full py-6 tactile bg-primary text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] border border-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 shadow-2xl disabled:opacity-50"
                        >
                            {isEnriching ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
                            {isEnriching ? t('detail.ai_loading') : (item.synonyms ? t('detail.ai_refresh') : t('detail.ai_enrich'))}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const Flashcard = ({ item, onStatusChange, onWordUpdate, lang = 'zh' }) => {
    const t = LocalizationAgent.t(lang);
    const [isFlipped, setIsFlipped] = useState(false);

    const handleAction = (e, status) => {
        e.stopPropagation();
        onStatusChange(item.id, status);
    };

    return (
        <div className="w-full max-w-6xl perspective-3000 min-h-[85vh] flex flex-col items-center justify-center">
            <div
                className={cn(
                    "relative w-full h-full transition-all duration-1000 transform-style-3d shadow-4xl rounded-[4rem] min-h-[750px]",
                    isFlipped ? "rotate-y-180" : ""
                )}
            >
                {/* Front Side */}
                <div className="absolute inset-0 backface-hidden bg-white dark:bg-slate-900 border border-primary/10 rounded-[4rem] p-16 flex flex-col items-center justify-center text-center overflow-hidden">
                    <div className="absolute top-0 right-0 p-20 opacity-[0.02] -z-10">
                        <Info size={300} className="text-primary" />
                    </div>

                    <div className="w-full max-w-2xl">
                        <div className="bg-primary/5 text-primary px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.4em] mb-20 inline-block border border-primary/10 shadow-sm animate-pulse">
                            {t('study.challenge')}
                        </div>
                        <h3 className="text-5xl font-black text-slate-900 dark:text-slate-100 leading-snug font-serif italic line-clamp-6 px-4 kinetic-text">
                            "{item.meaning_en}"
                        </h3>
                    </div>

                    <div className="mt-28 w-1/2">
                        <button
                            onClick={() => setIsFlipped(true)}
                            className="w-full py-8 bg-slate-900 dark:bg-primary text-white rounded-[2.5rem] font-black uppercase tracking-[0.35em] flex items-center justify-center gap-4 hover:scale-105 active:scale-95 transition-all shadow-4xl animate-squishy"
                        >
                            <Eye size={32} /> {t('study.reveal_insight')}
                        </button>
                    </div>
                </div>

                {/* Back Side */}
                <div className="absolute inset-0 backface-hidden bg-white dark:bg-slate-900 border border-primary/10 rounded-[4rem] p-12 flex flex-col rotate-y-180 overflow-y-auto custom-scrollbar">
                    <div className="flex justify-between items-center mb-10 px-4">
                        <div className="bg-green-500/10 text-green-600 px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-widest border border-green-500/10">
                            {t('study.learning_mode')}
                        </div>
                        <button
                            onClick={() => setIsFlipped(false)}
                            className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-primary transition-all border border-transparent hover:border-primary/20"
                        >
                            <RotateCcw size={24} />
                        </button>
                    </div>

                    <WordDetailContent
                        item={item}
                        onStatusChange={onStatusChange}
                        onWordUpdate={onWordUpdate}
                        lang={lang}
                    />

                    {/* Bottom Sticky Actions (Only for Flashcard Context) */}
                    <div className="mt-12 pt-12 border-t border-slate-100 dark:border-slate-800 flex gap-6 px-4">
                        <button
                            onClick={(e) => handleAction(e, 'unmastered')}
                            className={cn(
                                "flex-1 py-7 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-4 border transition-all",
                                item.status === 'unmastered'
                                    ? "bg-orange-500 text-white border-orange-500 shadow-3xl shadow-orange-500/30"
                                    : "bg-white dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-orange-50 hover:text-orange-500"
                            )}
                        >
                            <HelpCircle size={24} /> {t('action.dont_know')}
                        </button>
                        <button
                            onClick={(e) => handleAction(e, 'mastered')}
                            className={cn(
                                "flex-1 py-7 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-4 border transition-all",
                                item.status === 'mastered'
                                    ? "bg-green-500 text-white border-green-500 shadow-3xl shadow-green-500/30"
                                    : "bg-white dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-green-50 hover:text-green-500"
                            )}
                        >
                            <CheckCircle size={24} /> {t('action.know')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const WordDetail = ({ item, onBack, onStatusChange, onWordUpdate, lang = 'zh' }) => {
    const t = LocalizationAgent.t(lang);
    const [isEnriching, setIsEnriching] = useState(false);

    const handleEnrich = async () => {
        setIsEnriching(true);
        try {
            const enriched = await EnrichmentAgent.enrichWord(item);
            if (onWordUpdate) {
                onWordUpdate(item.id, {
                    synonyms: enriched.synonyms,
                    examples: enriched.examples,
                    pronunciation: enriched.pronunciation,
                    meaning_en: enriched.meaning_en
                });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsEnriching(false);
        }
    };

    return (
        <div className="w-full max-w-7xl bg-white dark:bg-slate-900 border border-primary/10 rounded-[4rem] p-12 md:p-20 flex flex-col items-center text-center shadow-4xl mx-auto my-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-24 opacity-[0.04] -rotate-12 pointer-events-none">
                <Sparkles size={320} className="text-primary" />
            </div>

            <div className="w-full flex justify-between items-center mb-16 relative z-10">
                <button
                    onClick={onBack}
                    className="p-5 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-[2rem] transition-all border border-slate-100 dark:border-slate-700 shadow-sm group"
                >
                    <ChevronLeft size={36} className="group-hover:-translate-x-1 transition-transform" />
                </button>
                <div className="flex gap-4">
                    <button
                        onClick={handleEnrich}
                        disabled={isEnriching}
                        className="px-10 py-5 bg-primary text-white rounded-[2rem] transition-all shadow-xl shadow-primary/20 flex items-center gap-4 group disabled:opacity-50 hover:scale-105 active:scale-95"
                    >
                        {isEnriching ? <Loader2 size={24} className="animate-spin" /> : <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />}
                        <span className="text-xs font-black uppercase tracking-[0.2em]">{t('detail.ai_enrich')}</span>
                    </button>
                </div>
            </div>

            <WordDetailContent
                item={item}
                onStatusChange={onStatusChange}
                onWordUpdate={onWordUpdate}
                isEnriching={isEnriching}
                onEnrich={handleEnrich}
                lang={lang}
            />

            <button
                onClick={onBack}
                className="w-full py-8 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-[2.5rem] font-black uppercase tracking-[0.3em] shadow-4xl hover:scale-[1.01] active:scale-95 transition-all mt-16 relative z-10 text-xs"
            >
                {t('study.return_lexicon')}
            </button>
        </div>
    );
};
