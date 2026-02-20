/**
 * EnrichmentAgent
 * Responsible for fetching additional word data (synonyms, collocations) from public APIs.
 */
export const EnrichmentAgent = {
    /**
     * Fetches synonyms and related words using Datamuse API
     */
    async fetchSynonyms(word) {
        try {
            const response = await fetch(`https://api.datamuse.com/words?rel_syn=${word}&max=10`);
            const data = await response.json();
            return data.map(item => item.word);
        } catch (error) {
            console.error("Synonym fetch failed:", error);
            return [];
        }
    },

    /**
     * Fetches definitions, pronunciation and examples using Free Dictionary API
     */
    async fetchDictionaryData(word) {
        try {
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            if (!response.ok) return null;
            const data = await response.json();
            const entry = data[0];

            const meaning = entry.meanings[0];
            const definition = meaning.definitions[0];

            // Gather multiple examples
            const examples = [];
            entry.meanings.forEach(m => {
                m.definitions.forEach(d => {
                    if (d.example) examples.push(d.example);
                });
            });

            return {
                pronunciation: entry.phonetic || (entry.phonetics[0] && entry.phonetics[0].text) || '',
                meaning_en: definition.definition || '',
                meaning_cn: '', // Dictionary API doesn't provide Chinese
                examples: examples.slice(0, 3)
            };
        } catch (error) {
            console.error("Dictionary fetch failed:", error);
            return null;
        }
    },

    /**
     * Main entry point to enrich a word object
     */
    async enrichWord(item) {
        const wordStr = typeof item === 'string' ? item : item.word;

        const [syns, dictData] = await Promise.all([
            this.fetchSynonyms(wordStr),
            this.fetchDictionaryData(wordStr)
        ]);

        const base = typeof item === 'string' ? { word: item, id: Date.now().toString() } : item;

        // Collect existing examples from all possible fields
        const existingExamples = [
            ...(Array.isArray(base.examples) ? base.examples : []),
            ...(base.example ? [base.example] : [])
        ].filter(Boolean);

        // Combine with new examples from AI, keeping original ones first and unique
        const aiExamples = dictData?.examples || [];
        const combinedExamples = [...new Set([...existingExamples, ...aiExamples])];

        return {
            ...base,
            pronunciation: base.pronunciation || (dictData?.pronunciation) || '',
            meaning_en: base.meaning_en || (dictData?.meaning_en) || '',
            synonyms: base.synonyms || syns.join(', '),
            examples: combinedExamples.slice(0, 5) // Keep up to 5 unique examples
        };
    }
};
