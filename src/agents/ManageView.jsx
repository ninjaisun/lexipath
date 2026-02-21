import React, { useState, useEffect, useMemo } from 'react';
import {
    LayoutGrid, Plus, Trash2, Download, Upload, Search,
    ChevronLeft, ChevronRight, CheckCircle2, Circle,
    MoreVertical, Info, Filter, ArrowUpDown, X, Loader2,
    Database, FileType, Check, AlertCircle, Sparkles, Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LocalProgress } from './LocalProgress';
import { VocabularyLoader } from './VocabularyLoader';
import { EnrichmentAgent } from './EnrichmentAgent';
import * as XLSX from 'xlsx';
import { LocalizationAgent } from './LocalizationAgent';

export const ManageView = ({ lang = 'zh' }) => {
    const t = LocalizationAgent.t(lang);
    const [vocab, setVocab] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newWord, setNewWord] = useState('');
    const [isEnriching, setIsEnriching] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        setIsLoading(true);
        const data = LocalProgress.loadVocabulary() || [];
        setVocab(data);
        setIsLoading(false);
    };

    const filteredVocab = useMemo(() => {
        return vocab.filter(item =>
            item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.meaning_cn && item.meaning_cn.includes(searchQuery)) ||
            (item.meaning_en && item.meaning_en.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [vocab, searchQuery]);

    const toggleSelect = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredVocab.length && filteredVocab.length > 0) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredVocab.map(v => v.id));
        }
    };

    const handleDelete = (id) => {
        if (window.confirm(t('manage.confirm_delete'))) {
            LocalProgress.deleteWord(id);
            loadData();
            setSelectedIds(prev => prev.filter(i => i !== id));
        }
    };

    const handleBulkDelete = () => {
        if (window.confirm(t('manage.confirm_bulk_delete', { count: selectedIds.length }))) {
            LocalProgress.deleteMultiple(selectedIds);
            loadData();
            setSelectedIds([]);
        }
    };

    const handleAddWord = async (e) => {
        e.preventDefault();
        if (!newWord.trim()) return;

        setIsEnriching(true);
        setError('');
        try {
            const exists = vocab.find(v => v.word.toLowerCase() === newWord.toLowerCase().trim());
            if (exists) throw new Error("Connection already exists in neural pathway.");

            const baseItem = {
                id: `id-${newWord.toLowerCase().trim().replace(/[^a-z0-9]/g, '-')}`,
                word: newWord.trim(),
                meaning_en: 'Syncing definition...',
                meaning_cn: '待更新',
                status: 'unmastered'
            };

            const enriched = await EnrichmentAgent.enrichWord(baseItem);
            LocalProgress.saveVocabulary([enriched]);
            loadData();
            setNewWord('');
            setIsAddModalOpen(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsEnriching(false);
        }
    };

    const handleImport = async (file) => {
        if (!file) return;
        setIsLoading(true);
        try {
            const data = await VocabularyLoader.fetchVocabulary(file);
            LocalProgress.saveVocabulary(data);
            loadData();
        } catch (err) {
            alert(`Sync Failed: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleExport = () => {
        if (vocab.length === 0) return;

        const worksheet = XLSX.utils.json_to_sheet(vocab.map(item => ({
            Vocabulary: item.word,
            Meaning: item.meaning_en,
            'Chinese Translation': item.meaning_cn,
            Pronunciation: item.pronunciation,
            Example: item.example || (item.examples && item.examples[0]) || '',
            Synonyms: item.synonyms,
            Status: item.status
        })));

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Lexicon");
        XLSX.writeFile(workbook, `lexipath_lexicon_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    return (
        <div className="p-8 lg:p-12 animate-in fade-in duration-700 bg-white dark:bg-slate-950 min-h-full">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic flex items-center gap-4 text-dashboard-title">
                        {t('manage.title_lexicon')} <span className="text-primary tracking-normal not-italic">{t('manage.title_manage')}</span>
                        <div className="px-3 py-1 bg-slate-100 dark:bg-slate-900 rounded-full text-[10px] font-black text-slate-500 tracking-widest border border-slate-200 dark:border-slate-800">
                            {vocab.length} {t('manage.units_count')}
                        </div>
                    </h1>
                    <p className="text-slate-400 font-medium text-sm mt-1 tracking-wide">{t('manage.desc')}</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <label className="px-6 py-4 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 rounded-2xl font-black uppercase tracking-widest text-[10px] border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-2 shadow-sm">
                        <Upload size={14} /> {t('manage.import')}
                        <input type="file" accept=".xlsx,.csv" className="hidden" onChange={(e) => handleImport(e.target.files[0])} />
                    </label>
                    <button
                        onClick={handleExport}
                        className="px-6 py-4 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 rounded-2xl font-black uppercase tracking-widest text-[10px] border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2 shadow-sm"
                    >
                        <Download size={14} /> {t('manage.export')}
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-[1.05] active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
                    >
                        <Plus size={16} /> {t('manage.add_word')}
                    </button>
                </div>
            </div>

            {/* Toolbar Area */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-3xl mb-8 border border-slate-100 dark:border-slate-800/50">
                <div className="flex-1 w-full relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder={t('manage.search')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 outline-none focus:ring-4 ring-primary/10 transition-all font-bold text-slate-700 dark:text-slate-200"
                    />
                </div>

                <div className="flex items-center gap-3">
                    {selectedIds.length > 0 && (
                        <div className="flex items-center gap-3 animate-in slide-in-from-right duration-500">
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{selectedIds.length} {t('manage.bulk_selection')}</span>
                            <button
                                onClick={handleBulkDelete}
                                className="p-4 bg-accent/10 text-accent rounded-xl hover:bg-accent hover:text-white transition-all shadow-sm border border-accent/20"
                                title={t('manage.bulk_delete')}
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    )}
                    <button className="p-4 bg-white dark:bg-slate-950 text-slate-400 rounded-xl border border-slate-100 dark:border-slate-800 hover:text-primary transition-all">
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white dark:bg-slate-900/30 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800/50">
                            <th className="p-6 w-16">
                                <button
                                    onClick={toggleSelectAll}
                                    className={cn(
                                        "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                                        selectedIds.length === filteredVocab.length && filteredVocab.length > 0
                                            ? "bg-primary border-primary text-white"
                                            : "border-slate-200 dark:border-slate-700 bg-transparent group-hover:border-primary/50"
                                    )}
                                >
                                    {selectedIds.length === filteredVocab.length && filteredVocab.length > 0 && <Check size={14} strokeWidth={4} />}
                                </button>
                            </th>
                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('manage.table_word')}</th>
                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden lg:table-cell">{t('manage.table_meaning')}</th>
                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden md:table-cell">{t('manage.table_status')}</th>
                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest w-24">{t('manage.table_actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                        {isLoading ? (
                            <tr>
                                <td colSpan="5" className="p-20 text-center text-dashboard-loading">
                                    <Loader2 className="animate-spin text-primary mx-auto mb-4" size={40} />
                                    <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">{t('manage.syncing')}</p>
                                </td>
                            </tr>
                        ) : filteredVocab.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="p-20 text-center text-dashboard-empty">
                                    <Database className="text-slate-200 dark:text-slate-800 mx-auto mb-4" size={60} />
                                    <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">{t('manage.empty')}</p>
                                </td>
                            </tr>
                        ) : (
                            filteredVocab.map((item) => (
                                <tr key={item.id} className={cn(
                                    "transition-colors group hover:bg-slate-50/50 dark:hover:bg-slate-800/20",
                                    selectedIds.includes(item.id) && "bg-primary/5 dark:bg-primary/10"
                                )}>
                                    <td className="p-6">
                                        <button
                                            onClick={() => toggleSelect(item.id)}
                                            className={cn(
                                                "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                                                selectedIds.includes(item.id)
                                                    ? "bg-primary border-primary text-white"
                                                    : "border-slate-200 dark:border-slate-700 bg-transparent group-hover:border-primary/50"
                                            )}
                                        >
                                            {selectedIds.includes(item.id) && <Check size={14} strokeWidth={4} />}
                                        </button>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex flex-col">
                                            <span className="font-black text-slate-900 dark:text-white text-lg tracking-tight group-hover:text-primary transition-colors">{item.word}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.pronunciation || t('manage.no_audio')}</span>
                                        </div>
                                    </td>
                                    <td className="p-6 hidden lg:table-cell">
                                        <div className="max-w-md">
                                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed truncate">{item.meaning_en}</p>
                                            <p className="text-xs font-bold text-slate-400 mt-1">{item.meaning_cn}</p>
                                        </div>
                                    </td>
                                    <td className="p-6 hidden md:table-cell">
                                        <div className={cn(
                                            "inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest",
                                            item.status === 'mastered'
                                                ? "bg-green-500/5 text-green-500 border-green-500/10"
                                                : "bg-accent/5 text-accent border-accent/10"
                                        )}>
                                            {item.status === 'mastered' ? <CheckCircle2 size={12} /> : <Circle size={12} className="animate-pulse" />}
                                            {item.status}
                                        </div>
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="p-3 text-slate-300 hover:text-accent hover:bg-accent/10 rounded-xl transition-all"
                                                title={t('manage.delete')}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            <button className="p-3 text-slate-300 hover:text-primary hover:bg-primary/10 rounded-xl transition-all">
                                                <Info size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Manual Add Modal Overlay */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => !isEnriching && setIsAddModalOpen(false)} />

                    <div className="relative w-full max-w-xl bg-white dark:bg-slate-950 rounded-[3.5rem] p-12 lg:p-16 border border-white/10 shadow-4xl animate-in zoom-in-95 duration-500 overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Plus size={80} className="text-primary" />
                        </div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-12">
                                <div>
                                    <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{t('manage.modal_new')}</h2>
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">{t('manage.modal_desc')}</p>
                                </div>
                                <button
                                    onClick={() => !isEnriching && setIsAddModalOpen(false)}
                                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-400 hover:text-white hover:bg-accent transition-all"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleAddWord} className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">{t('manage.modal_word')}</label>
                                    <input
                                        type="text"
                                        required
                                        autoFocus
                                        placeholder={t('manage.modal_word_placeholder')}
                                        value={newWord}
                                        onChange={(e) => setNewWord(e.target.value)}
                                        className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800 outline-none focus:ring-8 ring-primary/5 transition-all font-black text-2xl text-slate-900 dark:text-white placeholder:text-slate-200 dark:placeholder:text-slate-800 uppercase"
                                    />
                                </div>

                                {error && (
                                    <div className="p-6 bg-accent/5 border border-accent/10 rounded-3xl flex items-start gap-4 animate-in shake">
                                        <AlertCircle className="text-accent" size={24} />
                                        <p className="text-xs font-black uppercase tracking-widest text-accent">{error}</p>
                                    </div>
                                )}

                                <div className="p-8 bg-primary/5 rounded-[2.5rem] border border-primary/10 flex items-center gap-6">
                                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group">
                                        <Sparkles size={24} className={cn(isEnriching && "animate-spin")} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Neural Enrichment Agent</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Will automatically fetch meaning, pronunciation, and examples.</p>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isEnriching || !newWord.trim()}
                                    className="w-full py-8 bg-primary text-white rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-[11px] shadow-3xl shadow-primary/20 flex items-center justify-center gap-4 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                                >
                                    {isEnriching ? (
                                        <>
                                            <Loader2 size={24} className="animate-spin" />
                                            {t('manage.modal_syncing')}
                                        </>
                                    ) : (
                                        <>
                                            {t('manage.modal_connect')} <Plus size={20} />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
