import React, { useState } from 'react';
import {
    Volume2, HelpCircle, CheckCircle, Eye, RefreshCw,
    Layers, List, Bookmark, Sparkles, Loader2, Search,
    ChevronLeft, Play, Info, Video, PlayCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { EnrichmentAgent } from './EnrichmentAgent';

/**
 * Shared Content Component for Word Details
 */
const YouGlishPlayer = ({ word }) => {
    const rootRef = React.useRef(null);
    const widgetRef = React.useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showIframeFallback, setShowIframeFallback] = useState(false);
    const widgetId = "yg-widget-" + Math.random().toString(36).substr(2, 9);

    const openSearch = () => {
        window.open(`https://youglish.com/pronounce/${encodeURIComponent(word)}/english`, '_blank');
    };

    React.useEffect(() => {
        let isMounted = true;
        let checkTimer;
        let timeoutTimer;

        // Reset state when word changes
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
                    partner: "lexipath_2026", // Added partner identifier
                    events: {
                        'onFetchDone': (e) => {
                            if (!isMounted) return;
                            setIsLoading(false);
                            if (e && e.total_results === 0) {
                                setError('No clips found');
                                // If no results in widget, maybe try iframe? No, iframe will show same.
                                // But if it's a restriction issue, FetchDone might not even fire.
                            } else {
                                setError(null);
                            }
                        },
                        'onError': (e) => {
                            if (!isMounted) return;
                            console.warn("YouGlish API Error:", e);
                            // Error code 3 or 403 status often means restriction
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

        // Production timeout is longer to allow for CDN and restriction detection
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
    }, [word]);

    if (!word) return null;

    return (
        <div className="relative rounded-[2rem] overflow-hidden border border-white/10 bg-black/40 z-10 min-h-[450px] flex items-center justify-center group/player shadow-2xl">
            {/* Background Branding */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                <Video size={200} />
            </div>

            {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-slate-900/95 z-30 animate-in fade-in duration-500">
                    <div className="relative">
                        <Loader2 size={40} className="animate-spin text-primary" />
                        <div className="absolute inset-0 blur-xl bg-primary/20 animate-pulse"></div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80">Neural Context Sync</span>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Streaming cinematic data...</span>
                    </div>
                </div>
            )}

            {error && !showIframeFallback && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 bg-slate-900 z-30 p-12 text-center animate-in zoom-in-95 fade-in duration-500">
                    <div className="w-20 h-20 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                        <Video size={36} className="text-slate-500" />
                    </div>
                    <h5 className="text-white font-black uppercase text-xs tracking-widest">{error}</h5>
                    <button
                        onClick={openSearch}
                        className="group flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/30"
                    >
                        <PlayCircle size={18} /> Open YouGlish
                    </button>
                </div>
            )}

            {showIframeFallback && (
                <div className="absolute inset-0 z-20 animate-in fade-in zoom-in-95 duration-1000">
                    <iframe
                        title="YouGlish Fallback"
                        src={`https://youglish.com/embed/${encodeURIComponent(word)}?english=1&narrow=1&ss=1&v=1`}
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
                    "w-full h-full min-h-[450px] transition-all duration-1000",
                    (isLoading || error || showIframeFallback) ? "opacity-0 blur-xl scale-95 invisible" : "opacity-100 blur-0 scale-100"
                )}
            ></div>
        </div>
    );
};

export const WordDetailContent = ({ item, onStatusChange, onWordUpdate, isEnriching: parentIsEnriching, onEnrich }) => {
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
        <div className="w-full space-y-8 text-left relative z-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {/* Word Header & SRS Indicator */}
            <div className="w-full text-center mb-10 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-accent">Review Urgency: Medium</span>
                </div>

                <div className="flex items-center justify-center gap-4">
                    <h2 className="text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-none kinetic-text">{item.word}</h2>
                    <button
                        onClick={() => speak(item.word)}
                        className="p-5 bg-white shadow-tactile text-primary rounded-[1.5rem] hover:bg-slate-50 transition-all active:scale-95 group"
                    >
                        <Volume2 size={24} className="group-hover:scale-110 transition-transform" />
                    </button>
                </div>
                <p className="text-slate-400 font-mono text-xl tracking-[0.4em] font-medium opacity-60">
                    {item.pronunciation || '/.../'}
                </p>
            </div>

            {/* Status Switcher - Tactile & Squishy */}
            {onStatusChange && (
                <div className="flex gap-4 p-3 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-[2rem] border border-white/20 shadow-inner-soft">
                    <button
                        onClick={() => onStatusChange(item.id, 'unmastered')}
                        className={cn(
                            "flex-1 py-4 rounded-[1.4rem] font-bold transition-all flex items-center justify-center gap-2",
                            item.status === 'unmastered'
                                ? "bg-white dark:bg-slate-800 text-orange-600 shadow-tactile border border-orange-100 font-black animate-squishy"
                                : "text-slate-400 hover:bg-white/50"
                        )}
                    >
                        <HelpCircle size={18} /> New Discovery
                    </button>
                    <button
                        onClick={() => onStatusChange(item.id, 'mastered')}
                        className={cn(
                            "flex-1 py-4 rounded-[1.4rem] font-bold transition-all flex items-center justify-center gap-2",
                            item.status === 'mastered'
                                ? "bg-white dark:bg-slate-800 text-primary shadow-tactile border border-primary/10 font-black animate-squishy"
                                : "text-slate-400 hover:bg-white/50"
                        )}
                    >
                        <CheckCircle size={18} /> Mastery Achieved
                    </button>
                </div>
            )}

            {/* Meanings & Real-world Context */}
            <div className="space-y-6">
                <div className="p-10 tactile rounded-[3rem] border border-white/10 group">
                    <h4 className="flex items-center gap-2 text-xs font-black uppercase text-primary mb-6 tracking-[0.2em] opacity-70">
                        <Sparkles size={14} /> Core Definition
                    </h4>
                    <div className="space-y-4">
                        <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 leading-tight">
                            {item.meaning_cn}
                        </p>
                        <div className="h-px w-12 bg-primary/20" />
                        <p className="text-xl text-slate-500 font-medium leading-relaxed italic">
                            {item.meaning_en || (item.examples?.[0]?.meaning_en)}
                        </p>
                    </div>
                </div>

                {/* High-Context Feature (Market Research) */}
                <div className="p-8 glass rounded-[3rem] border border-white/20">
                    <h4 className="flex items-center gap-2 text-xs font-black uppercase text-accent mb-6 tracking-[0.2em]">
                        <List size={14} /> When to use this? (Social Context)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {['Professional Meetings', 'Academic Writing', 'Casual Debate'].map((context, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
                                    <Play size={16} fill="currentColor" />
                                </div>
                                <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">{context}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* Video Connection */}
            <div className="p-10 bg-slate-900 rounded-[3rem] border border-white/10 shadow-tactile overflow-hidden relative group min-h-[480px]">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                    <Video size={100} className="text-primary" />
                </div>

                <h4 className="flex items-center gap-2 text-xs font-black uppercase text-slate-500 mb-6 tracking-widest relative z-10">
                    <PlayCircle size={18} className="text-primary" /> Learning with Media
                </h4>

                <YouGlishPlayer word={item.word} />

                <p className="mt-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center">
                    Witness how <span className="text-primary">"{item.word}"</span> is used in native speaker contexts
                </p>
            </div>

            {/* Synonyms & Examples */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 p-8 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-[2.5rem] border border-white/20 shadow-sm min-h-[140px] flex flex-col">
                    <h4 className="flex items-center gap-2 text-[11px] font-black uppercase text-slate-400 mb-4 tracking-widest">
                        <RefreshCw size={16} /> Similar Concepts
                    </h4>
                    {item.synonyms ? (
                        <div className="flex flex-wrap gap-2">
                            {item.synonyms.split(',').map((s, i) => (
                                <span key={i} className="px-3 py-1 bg-white/80 dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700">
                                    {s.trim()}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-300 dark:text-slate-700 gap-2">
                            <Search size={24} strokeWidth={1.5} />
                            <span className="text-[9px] uppercase font-black">AI Augmentation Needed</span>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-2 p-10 tactile rounded-[3rem] border border-white/10 space-y-8">
                    <h4 className="flex items-center gap-2 text-xs font-black uppercase text-slate-400 mb-2 tracking-widest">
                        <List size={18} /> Cinematic Usage
                    </h4>
                    {examples.length > 0 ? (
                        <div className="space-y-6">
                            {examples.slice(0, 3).map((ex, idx) => (
                                <div key={idx} className="group relative pl-4 border-l-4 border-primary/20 hover:border-primary transition-all">
                                    <p className="text-xl text-slate-700 dark:text-slate-200 italic font-serif leading-relaxed font-medium">
                                        "{highlightWord(ex, item.word)}"
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 opacity-20">No examples found.</div>
                    )}
                </div>
            </div>
            {/* AI Insights Button */}
            <div className="flex flex-col gap-4">
                <button
                    onClick={handleEnrich}
                    disabled={isEnriching}
                    className="w-full py-5 tactile bg-primary text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.25em] border border-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-2xl disabled:opacity-50"
                >
                    {isEnriching ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                    {item.synonyms ? 'Refresh AI Insights' : 'Smart Enrich Intelligence'}
                </button>
            </div>
        </div>
    );
};

export const Flashcard = ({ item, onStatusChange, onWordUpdate }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleAction = (e, status) => {
        e.stopPropagation();
        onStatusChange(item.id, status);
        // Removed setFlipped(false) to let user see feedback if they stay
    };

    return (
        <div className="w-full max-w-2xl perspective-2000 h-[700px]">
            <div
                className={cn(
                    "relative w-full h-full transition-all duration-700 transform-style-3d shadow-3xl rounded-[3rem]",
                    isFlipped ? "rotate-y-180" : ""
                )}
            >
                {/* Front Side */}
                <div className="absolute inset-0 backface-hidden bg-white dark:bg-slate-900 border border-primary/10 rounded-[3rem] p-12 flex flex-col items-center justify-center text-center overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.02]">
                        <Info size={180} className="text-primary" />
                    </div>

                    <div className="w-full">
                        <div className="bg-primary/5 text-primary px-6 py-2 rounded-full text-xs font-black uppercase tracking-[0.3em] mb-16 inline-block border border-primary/10 shadow-sm">
                            Concept Challenge
                        </div>
                        <h3 className="text-4xl font-medium text-slate-800 dark:text-slate-100 leading-relaxed font-serif italic line-clamp-6 px-4">
                            "{item.meaning_en}"
                        </h3>
                    </div>

                    <div className="mt-20 w-3/4">
                        <button
                            onClick={() => setIsFlipped(true)}
                            className="w-full py-6 bg-slate-900 dark:bg-primary text-white rounded-[2rem] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-2xl"
                        >
                            <Eye size={24} /> Reveal Insight
                        </button>
                    </div>
                </div>

                {/* Back Side */}
                <div className="absolute inset-0 backface-hidden bg-white dark:bg-slate-900 border border-primary/10 rounded-[3rem] p-12 flex flex-col rotate-y-180 overflow-y-auto custom-scrollbar">
                    <div className="flex justify-between items-center mb-8">
                        <div className="bg-green-500/10 text-green-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-500/10">
                            Learning Mode
                        </div>
                        <button
                            onClick={() => setIsFlipped(false)}
                            className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-primary transition-all"
                        >
                            <RefreshCw size={20} />
                        </button>
                    </div>

                    <WordDetailContent
                        item={item}
                        onStatusChange={onStatusChange}
                        onWordUpdate={onWordUpdate}
                    />

                    <div className="mt-10 pt-10 border-t border-slate-100 dark:border-slate-800 flex gap-4">
                        <button
                            onClick={(e) => handleAction(e, 'unmastered')}
                            className={cn(
                                "flex-1 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 border transition-all",
                                item.status === 'unmastered'
                                    ? "bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/30"
                                    : "bg-white dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-orange-50 hover:text-orange-500"
                            )}
                        >
                            <HelpCircle size={20} /> I don't know
                        </button>
                        <button
                            onClick={(e) => handleAction(e, 'mastered')}
                            className={cn(
                                "flex-1 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 border transition-all",
                                item.status === 'mastered'
                                    ? "bg-green-500 text-white border-green-500 shadow-lg shadow-green-500/30"
                                    : "bg-white dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-green-50 hover:text-green-500"
                            )}
                        >
                            <CheckCircle size={20} /> I got this
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const WordDetail = ({ item, onBack, onStatusChange, onWordUpdate }) => {
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
        <div className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-primary/10 rounded-[3rem] p-12 flex flex-col items-center text-center shadow-3xl mx-auto my-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-16 opacity-[0.04] -rotate-12 pointer-events-none">
                <Sparkles size={240} className="text-primary" />
            </div>

            <div className="w-full flex justify-between items-center mb-12 relative z-10">
                <button
                    onClick={onBack}
                    className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-[1.5rem] transition-all border border-slate-100 dark:border-slate-700 shadow-sm"
                >
                    <ChevronLeft size={28} />
                </button>
                <div className="flex gap-3">
                    <button
                        onClick={handleEnrich}
                        disabled={isEnriching}
                        className="px-6 py-4 bg-primary text-white rounded-[1.5rem] transition-all shadow-xl shadow-primary/20 flex items-center gap-3 group disabled:opacity-50 hover:scale-105 active:scale-95"
                    >
                        {isEnriching ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />}
                        <span className="text-xs font-black uppercase tracking-widest">Smart Enrich</span>
                    </button>
                </div>
            </div>

            <WordDetailContent
                item={item}
                onStatusChange={onStatusChange}
                onWordUpdate={onWordUpdate}
                isEnriching={isEnriching}
                onEnrich={handleEnrich}
            />

            <button
                onClick={onBack}
                className="w-full py-6 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all mt-10 relative z-10"
            >
                Return to Lexicon
            </button>
        </div>
    );
};
