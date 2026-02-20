import React, { useState, useEffect, useMemo } from 'react';
import { VocabularyLoader } from './VocabularyLoader';
import { LocalProgress } from './LocalProgress';
import { Flashcard, WordDetail } from './LearningUI';
import { EnrichmentAgent } from './EnrichmentAgent';
import {
    ChevronLeft, ChevronRight, BookOpen, Link, Send, Loader2,
    RotateCcw, RefreshCw, Search, Filter, Play,
    CheckCircle2, Circle, ArrowRight, LayoutGrid, Plus,
    Trash2, X, Sparkles, Database, EyeOff, Zap, LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const StudyView = ({ onLogout }) => {
    const [vocab, setVocab] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('lexicon'); // lexicon, study, detail
    const [selectedWord, setSelectedWord] = useState(null);
    const [url, setUrl] = useState('https://docs.google.com/spreadsheets/d/1mSCWy-WeX8QTNgDQ5bSDx51C7ao7Tonpv7uiL6JFn30/edit?usp=sharing');
    const [newWord, setNewWord] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sessionVocab, setSessionVocab] = useState([]);
    const [isImporting, setIsImporting] = useState(false);
    const [isFocusMode, setIsFocusMode] = useState(false);

    useEffect(() => {
        refreshData();
    }, []);

    const refreshData = () => {
        try {
            const savedVocab = LocalProgress.loadVocabulary();
            if (savedVocab && Array.isArray(savedVocab)) {
                const processedData = LocalProgress.mergeWithVocab(savedVocab);
                setVocab(processedData);
            }
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleImportData = async (source) => {
        setError('');
        setIsImporting(true);
        try {
            const rawData = await VocabularyLoader.fetchVocabulary(source);
            if (!rawData || rawData.length === 0) throw new Error("No data found.");

            LocalProgress.saveVocabulary(rawData);
            refreshData();
        } catch (err) {
            setError(`Failed: ${err.message}`);
        } finally {
            setIsImporting(false);
        }
    };

    const handleAddManual = async () => {
        if (!newWord.trim()) return;
        setIsAdding(true);
        setError('');
        try {
            const exists = vocab.find(v => v.word.toLowerCase() === newWord.toLowerCase().trim());
            if (exists) throw new Error("Word already in lexicon.");

            // Basic item first
            const baseItem = {
                id: Date.now().toString(),
                word: newWord.trim(),
                meaning_en: 'Fetching definition...',
                meaning_cn: '待更新',
                status: 'unmastered'
            };

            // Enrichment
            const enriched = await EnrichmentAgent.enrichWord(baseItem);
            LocalProgress.saveVocabulary([enriched]);
            refreshData();
            setNewWord('');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsAdding(false);
        }
    };

    const startStudySession = () => {
        const unmastered = vocab.filter(v => v.status === 'unmastered');
        const shuffled = [...unmastered].sort(() => 0.5 - Math.random());
        const session = shuffled.slice(0, 10);

        if (session.length === 0) {
            alert("All words mastered! Reset some to study again.");
            return;
        }

        setSessionVocab(session);
        setCurrentIndex(0);
        setViewMode('study');
    };

    const handleStatusChange = (id, status) => {
        LocalProgress.updateWordStatus(id, status);
        setVocab(prev => prev.map(v => v.id === id ? { ...v, status } : v));
        setSessionVocab(prev => prev.map(v => v.id === id ? { ...v, status } : v));
    };

    const handleWordUpdate = (id, fields) => {
        LocalProgress.updateWord(id, fields);
        setVocab(prev => prev.map(v => v.id === id ? { ...v, ...fields } : v));
        if (selectedWord && selectedWord.id === id) {
            setSelectedWord(prev => ({ ...prev, ...fields }));
        }
    };

    const filteredVocab = useMemo(() => {
        return vocab.filter(v => {
            const matchesSearch = v.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (v.meaning_cn && v.meaning_cn.includes(searchQuery));
            const matchesFilter = statusFilter === 'all' || v.status === statusFilter;
            return matchesSearch && matchesFilter;
        });
    }, [vocab, searchQuery, statusFilter]);

    if (loading) return (
        <div className="h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}></div>
            <div className="relative">
                <div className="w-20 h-20 bg-primary rounded-3xl animate-morphing flex items-center justify-center shadow-2xl">
                    <Zap className="text-white animate-pulse" size={32} />
                </div>
                <div className="absolute inset-0 bg-primary/20 blur-3xl animate-pulse -z-10" />
            </div>
            <span className="font-black text-primary mt-12 tracking-[0.5em] uppercase text-[10px] animate-pulse">Initializing LexiPath 2026</span>
        </div>
    );

    // Lexicon Management View
    if (viewMode === 'lexicon') return (
        <div className={cn(
            "min-h-screen transition-all duration-700 relative",
            isFocusMode ? "bg-white dark:bg-black" : "bg-background md:p-12 p-6"
        )}>
            {/* Global Focus Mode Toggle (Overlay) */}
            {isFocusMode && (
                <button
                    onClick={() => setIsFocusMode(false)}
                    className="fixed top-8 right-8 z-50 p-4 bg-primary text-white rounded-full shadow-2xl animate-squishy group"
                >
                    <Zap size={24} className="group-hover:scale-125 transition-transform" />
                </button>
            )}

            <div className={cn(
                "max-w-6xl mx-auto transition-all duration-1000",
                isFocusMode ? "opacity-0 blur-3xl scale-90 invisible h-0 overflow-hidden" : "opacity-100"
            )}>
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="p-4 tactile rounded-[1.5rem] text-primary">
                                <Database size={28} />
                            </div>
                            <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter kinetic-text uppercase italic">
                                Lexicon <span className="italic-definition font-serif lowercase font-medium text-3xl tracking-normal text-primary">vault</span>
                            </h1>
                        </div>
                        <p className="text-slate-400 font-bold flex items-center gap-3 tracking-widest uppercase text-[10px]">
                            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                            {vocab.filter(v => v.status === 'mastered').length} units mastered
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <button
                            onClick={() => setIsFocusMode(true)}
                            className="p-4 bg-secondary text-secondary-foreground rounded-[1.5rem] shadow-sm hover:scale-105 active:scale-95 transition-all group"
                        >
                            <EyeOff size={20} className="group-hover:rotate-12 transition-transform" />
                        </button>
                        {onLogout && (
                            <button
                                onClick={onLogout}
                                className="p-4 bg-white dark:bg-slate-900 rounded-[1.5rem] text-slate-400 hover:text-accent transition-all shadow-sm border border-slate-100 dark:border-slate-800"
                                title="Neural Disconnect"
                            >
                                <LogOut size={20} />
                            </button>
                        )}
                        <button
                            onClick={startStudySession}
                            disabled={vocab.length === 0}
                            className="px-10 py-5 bg-primary text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] shadow-tactile animate-squishy hover:rotate-1 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
                        >
                            <Zap size={18} fill="currentColor" /> Ignite Session
                        </button>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-6 p-4 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-[2.5rem] border border-white/20 shadow-inner-soft">
                    <div className="flex items-center p-2 bg-white/80 dark:bg-slate-900 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex-1 w-full">
                        <label className="p-3 text-slate-400 hover:text-primary cursor-pointer transition-all hover:scale-110" title="Import Local Lexicon">
                            <input type="file" accept=".xlsx,.csv" className="hidden" onChange={(e) => handleImportData(e.target.files[0])} />
                            <LayoutGrid size={22} />
                        </label>
                        <div className="w-px h-6 bg-slate-100 dark:bg-slate-800 mx-1" />
                        <button
                            onClick={() => handleImportData(url)}
                            disabled={isImporting}
                            className="p-3 text-slate-400 hover:text-primary transition-all hover:rotate-90 disabled:opacity-50"
                            title="Remote Sync"
                        >
                            {isImporting ? <Loader2 size={22} className="animate-spin" /> : <RefreshCw size={22} />}
                        </button>
                    </div>
                </div>
            </div>
            {/* Lexicon Grid Section */}
            <div className="mt-12">
                {vocab.length === 0 ? (
                    <div className="py-32 text-center bg-white/50 dark:bg-slate-900/50 rounded-[4rem] border border-dashed border-slate-200 dark:border-slate-800 backdrop-blur-sm tactile">
                        <div className="w-24 h-24 bg-primary/5 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8">
                            <BookOpen size={48} className="text-primary/20" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-400 mb-2">Lexicon Vault Empty</h2>
                        <p className="text-slate-300 font-medium max-w-sm mx-auto mb-8 tracking-wide">Initialize your neural database by syncing from the network or adding units manually.</p>
                        <div className="flex justify-center gap-4">
                            <input type="file" id="empty-file" className="hidden" onChange={(e) => handleImportData(e.target.files[0])} />
                            <label htmlFor="empty-file" className="px-8 py-4 bg-primary text-white rounded-[2rem] font-bold cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-tactile text-xs uppercase tracking-widest">Local Import</label>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredVocab.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => {
                                    setSelectedWord(item);
                                    setViewMode('detail');
                                }}
                                className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/20 shadow-sm hover:shadow-tactile hover:scale-[1.02] hover:border-primary/20 transition-all group cursor-pointer relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity">
                                    <Sparkles size={60} className="text-primary" />
                                </div>

                                <div className="flex justify-between items-start mb-6">
                                    <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight leading-none group-hover:text-primary transition-colors">{item.word}</h3>
                                    {item.status === 'mastered' ? (
                                        <div className="w-8 h-8 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center shadow-inner">
                                            <CheckCircle2 size={16} />
                                        </div>
                                    ) : (
                                        <div className="w-8 h-8 bg-accent/10 text-accent rounded-full flex items-center justify-center shadow-inner animate-pulse">
                                            <Circle size={16} />
                                        </div>
                                    )}
                                </div>
                                <p className="text-slate-400 text-sm font-medium line-clamp-2 mb-6 leading-relaxed font-serif italic italic-dashboard opacity-80 group-hover:opacity-100 transition-opacity">
                                    "{item.meaning_en}"
                                </p>
                                <div className="flex justify-between items-center pt-6 border-t border-slate-100 dark:border-slate-800">
                                    <span className={cn(
                                        "text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full",
                                        item.status === 'mastered' ? "bg-primary/5 text-primary border border-primary/10" : "bg-accent/5 text-accent border border-accent/10"
                                    )}>
                                        {item.status === 'mastered' ? 'Mastered' : 'Acquiring'}
                                    </span>
                                    <div className="text-slate-900 dark:text-slate-200 font-bold text-base tracking-tight">{item.meaning_cn}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    // Full Screen Study View
    if (viewMode === 'study') return (
        <div className="fixed inset-0 min-h-screen bg-slate-900 text-white z-50 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-8 flex justify-between items-center w-full max-w-7xl mx-auto">
                <button
                    onClick={() => {
                        setViewMode('lexicon');
                        refreshData();
                    }}
                    className="flex items-center gap-3 text-slate-400 hover:text-white font-black uppercase tracking-widest text-xs transition-all"
                >
                    <X size={24} /> Close Session
                </button>
                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-4 mb-2">
                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em]">Progression</span>
                        <span className="text-sm font-black text-primary px-3 py-1 bg-primary/10 rounded-lg">{currentIndex + 1} / {sessionVocab.length}</span>
                    </div>
                    <div className="w-64 h-1.5 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                        <div
                            className="h-full bg-primary transition-all duration-700 ease-out shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                            style={{ width: `${((currentIndex + 1) / sessionVocab.length) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative">
                {sessionVocab[currentIndex] ? (
                    <>
                        <div key={sessionVocab[currentIndex].id} className="w-full max-w-4xl flex flex-col items-center animate-in fade-in zoom-in duration-700">
                            <Flashcard
                                item={sessionVocab[currentIndex]}
                                onStatusChange={handleStatusChange}
                                onWordUpdate={handleWordUpdate}
                            />
                        </div>

                        {/* Navigation Overlay */}
                        <div className="absolute left-10 top-1/2 -translate-y-1/2 hidden xl:block">
                            <button
                                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                                disabled={currentIndex === 0}
                                className="p-10 bg-white/5 hover:bg-white/10 rounded-full text-white/20 hover:text-white transition-all disabled:opacity-0 disabled:pointer-events-none border border-white/10"
                            >
                                <ChevronLeft size={48} />
                            </button>
                        </div>
                        <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden xl:block">
                            <button
                                onClick={() => {
                                    if (currentIndex < sessionVocab.length - 1) {
                                        setCurrentIndex(prev => prev + 1);
                                    } else {
                                        setSessionVocab([]); // Finish
                                    }
                                }}
                                className="p-10 bg-primary/10 hover:bg-primary/20 rounded-full text-primary hover:text-white transition-all border border-primary/20"
                            >
                                <ChevronRight size={48} />
                            </button>
                        </div>

                        {/* Mobile Navigation */}
                        <div className="mt-12 flex gap-6 xl:hidden">
                            <button
                                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                                disabled={currentIndex === 0}
                                className="w-20 h-20 flex items-center justify-center bg-white/5 rounded-3xl border border-white/10 disabled:opacity-20"
                            >
                                <ChevronLeft size={32} />
                            </button>
                            <button
                                onClick={() => {
                                    if (currentIndex < sessionVocab.length - 1) {
                                        setCurrentIndex(prev => prev + 1);
                                    } else {
                                        setSessionVocab([]);
                                    }
                                }}
                                className="w-20 h-20 flex items-center justify-center bg-primary text-white rounded-3xl border border-primary/20"
                            >
                                <ChevronRight size={32} />
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="text-center p-16 bg-slate-800/50 backdrop-blur-3xl rounded-[4rem] border border-white/10 max-w-lg w-full shadow-4xl animate-in zoom-in slide-in-from-bottom duration-700">
                        <div className="w-32 h-32 bg-green-500/10 text-green-500 rounded-[3rem] flex items-center justify-center mx-auto mb-10 shadow-inner">
                            <CheckCircle2 size={64} strokeWidth={1.5} />
                        </div>
                        <h2 className="text-4xl font-black text-white mb-6 uppercase tracking-tighter">Peak Mastery</h2>
                        <p className="text-slate-400 mb-12 font-medium leading-relaxed">Your neural connections for these {sessionVocab.length} words have been reinforced. Return to Lexicon for the next challenge.</p>
                        <button
                            onClick={() => setViewMode('lexicon')}
                            className="w-full py-6 bg-primary text-white rounded-3xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-3xl shadow-primary/40 hover:scale-105 transition-all"
                        >
                            Complete Session <ArrowRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    // Detail View
    if (viewMode === 'detail' && selectedWord) return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 flex flex-col">
            <WordDetail
                item={selectedWord}
                onBack={() => setViewMode('lexicon')}
                onStatusChange={(id, status) => {
                    handleStatusChange(id, status);
                    setSelectedWord(prev => ({ ...prev, status }));
                }}
                onWordUpdate={handleWordUpdate}
            />
        </div>
    );

    return null;
};
