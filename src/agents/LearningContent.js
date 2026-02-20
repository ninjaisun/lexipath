/**
 * LearningContent Agent
 * Responsible for the learning logic, filtering words, and managing sessions.
 */
export const LearningContent = {
    filterByStatus(vocab, status) {
        if (status === 'all') return vocab;
        return vocab.filter(item => item.status === status);
    },

    getRandomSubset(vocab, size) {
        const shuffled = [...vocab].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, size);
    },

    getExplanationStyle(level) {
        // Return instructions/metadata for the UI to adjust explanation simplicity
        return {
            level: level || 'B2',
            rules: [
                "Use simple, clear English",
                "Prioritize common phrases",
                "Avoid academic jargon"
            ]
        };
    }
};
