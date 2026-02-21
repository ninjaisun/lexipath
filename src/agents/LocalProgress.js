/**
 * LocalProgress Agent
 * Responsible for saving and loading learning progress locally.
 */
const STORAGE_KEY = 'vocab_app_progress';
const VOCAB_KEY = 'vocab_app_data';

export const LocalProgress = {
    saveProgress(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    },

    loadProgress() {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : {};
    },

    saveVocabulary(newVocab) {
        if (!newVocab || !Array.isArray(newVocab)) return;

        const existingVocab = this.loadVocabulary() || [];
        // Use word as a secondary key if ID is generic
        const vocabMap = new Map();

        // Load existing first to keep status
        existingVocab.forEach(item => {
            vocabMap.set(item.id, item);
        });

        // Merge new items
        newVocab.forEach(item => {
            if (!vocabMap.has(item.id)) {
                vocabMap.set(item.id, item);
            } else {
                // Update existing item content but keep status if it exists
                const existing = vocabMap.get(item.id);
                vocabMap.set(item.id, { ...item, status: existing.status || item.status || 'unmastered' });
            }
        });

        const mergedVocab = Array.from(vocabMap.values());
        localStorage.setItem(VOCAB_KEY, JSON.stringify(mergedVocab));
    },

    loadVocabulary() {
        try {
            const saved = localStorage.getItem(VOCAB_KEY);
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            console.error("Error loading vocab:", e);
            return null;
        }
    },

    updateWordStatus(wordId, status) {
        // Update status labels
        const progress = this.loadProgress();
        progress[wordId] = status;
        this.saveProgress(progress);

        // Reflect in vocab list
        const vocab = this.loadVocabulary();
        if (vocab) {
            const updatedVocab = vocab.map(item =>
                item.id === wordId ? { ...item, status } : item
            );
            localStorage.setItem(VOCAB_KEY, JSON.stringify(updatedVocab));
        }
    },

    updateWord(wordId, updatedFields) {
        const vocab = this.loadVocabulary();
        if (vocab) {
            const updatedVocab = vocab.map(item =>
                item.id === wordId ? { ...item, ...updatedFields } : item
            );
            localStorage.setItem(VOCAB_KEY, JSON.stringify(updatedVocab));
        }
    },

    mergeWithVocab(vocab) {
        if (!vocab || !Array.isArray(vocab)) return [];
        const progress = this.loadProgress();
        return vocab.map(item => ({
            ...item,
            status: progress[item.id] || item.status || 'unmastered'
        }));
    },

    deleteWord(wordId) {
        const vocab = this.loadVocabulary() || [];
        const filtered = vocab.filter(item => item.id !== wordId);
        localStorage.setItem(VOCAB_KEY, JSON.stringify(filtered));

        const progress = this.loadProgress();
        delete progress[wordId];
        this.saveProgress(progress);
    },

    deleteMultiple(wordIds) {
        if (!Array.isArray(wordIds)) return;
        const vocab = this.loadVocabulary() || [];
        const filtered = vocab.filter(item => !wordIds.includes(item.id));
        localStorage.setItem(VOCAB_KEY, JSON.stringify(filtered));

        const progress = this.loadProgress();
        wordIds.forEach(id => delete progress[id]);
        this.saveProgress(progress);
    },

    clearVocab() {
        localStorage.removeItem(VOCAB_KEY);
        localStorage.removeItem(STORAGE_KEY);
    }
};
