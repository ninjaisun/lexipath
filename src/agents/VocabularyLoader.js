import * as XLSX from 'xlsx';

/**
 * VocabularyLoader Agent
 * Responsible for fetching data from Excel (.xlsx), Google Sheets (CSV) or using Mock data.
 */
export const VocabularyLoader = {
    async fetchVocabulary(source) {
        if (!source) {
            return this.getMockData();
        }

        // Handle browser File objects (from <input type="file">)
        if (source instanceof File) {
            return this.readFile(source);
        }

        const url = source;
        const isExcel = url.toLowerCase().endsWith('.xlsx');
        const csvUrl = isExcel ? url : this.convertUrlToCsv(url);

        try {
            const response = await fetch(csvUrl);
            const data = await response.arrayBuffer();

            if (isExcel || this.isBinary(data)) {
                return this.parseExcel(data);
            } else {
                const decoder = new TextDecoder();
                return this.parseCSV(decoder.decode(data));
            }
        } catch (error) {
            console.error("Failed to fetch vocabulary:", error);
            throw error;
        }
    },

    isBinary(buffer) {
        const arr = new Uint8Array(buffer).subarray(0, 4);
        // Check for ZIP/XLSX signature (PK..)
        return arr[0] === 0x50 && arr[1] === 0x4B;
    },

    readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = e.target.result;
                    if (file.name.endsWith('.xlsx')) {
                        resolve(this.parseExcel(data));
                    } else {
                        const decoder = new TextDecoder();
                        resolve(this.parseCSV(decoder.decode(data)));
                    }
                } catch (err) {
                    reject(err);
                }
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    },

    parseExcel(data) {
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        return this.mapToInternalFormat(jsonData);
    },

    convertUrlToCsv(url) {
        if (!url) return '';
        if (url.includes('/export?format=csv')) return url;

        let cleanedUrl = url.trim().replace(/\/+$/, '');
        if (cleanedUrl.includes('/edit')) {
            return cleanedUrl.replace(/\/edit(#.*)?$/, '/export?format=csv');
        } else if (cleanedUrl.includes('/view')) {
            return cleanedUrl.replace(/\/view(#.*)?$/, '/export?format=csv');
        }
        return cleanedUrl;
    },

    parseCSV(csv) {
        const lines = csv.split('\n').filter(line => line.trim() !== '');
        if (lines.length < 2) return [];

        const splitLine = (text) => {
            const result = [];
            let current = '';
            let inQuotes = false;
            for (let i = 0; i < text.length; i++) {
                const char = text[i];
                if (char === '"') inQuotes = !inQuotes;
                else if (char === ',' && !inQuotes) {
                    result.push(current.trim());
                    current = '';
                } else {
                    current += char;
                }
            }
            result.push(current.trim());
            return result;
        };

        const rawHeaders = splitLine(lines[0]).map(h => h.trim());
        const data = lines.slice(1).map(line => {
            const values = splitLine(line);
            return rawHeaders.reduce((obj, header, i) => {
                obj[header] = values[i] || '';
                return obj;
            }, {});
        });

        return this.mapToInternalFormat(data);
    },

    mapToInternalFormat(rawData) {
        return rawData.map((rawItem, index) => {
            const word = rawItem['Vocabulary'] || rawItem['vocabulary'] || rawItem['word'] || '';
            const item = {
                word: word,
                pronunciation: rawItem['Pronunciation'] || rawItem['pronunciation'] || '',
                meaning_cn: rawItem['Chinese Translation'] || rawItem['chinese translation'] || rawItem['meaning_cn'] || '',
                meaning_en: rawItem['Meaning'] || rawItem['meaning'] || rawItem['meaning_en'] || '',
                example: rawItem['Sample Sentence'] || rawItem['sample sentence'] || rawItem['example'] || '',
                synonyms: rawItem['Synonyms'] || rawItem['synonyms'] || '',
                collocations: rawItem['Collocations'] || rawItem['collocations'] || rawItem['Phrases'] || '',
                status: 'unmastered'
            };
            item.id = `id-${word.toLowerCase().trim().replace(/[^a-z0-9]/g, '-')}`;
            return item;
        }).filter(item => item.word);
    },

    getMockData() {
        return [
            {
                id: "1",
                word: "Pragmatic",
                phrase: "Take a pragmatic approach",
                example: "We need to take a pragmatic approach to solve this problem quickly.",
                meaning_en: "Dealing with things sensibly and realistically in a way that is based on practical rather than theoretical considerations.",
                meaning_cn: "务实的，讲究实效的",
                pronunciation: "/praɡˈmadik/",
                status: "new"
            },
            {
                id: "2",
                word: "Ambiguous",
                phrase: "An ambiguous statement",
                example: "The instructions were so ambiguous that no one knew what to do.",
                meaning_en: "Open to more than one interpretation; not having one obvious meaning.",
                meaning_cn: "模棱两可的，含糊不清的",
                pronunciation: "/amˈbiɡyo͞oəs/",
                status: "new"
            },
            {
                id: "3",
                word: "Eloquent",
                phrase: "An eloquent speaker",
                example: "She made an eloquent appeal for support.",
                meaning_en: "Fluent or persuasive in speaking or writing.",
                meaning_cn: "雄辩的，有说服力的",
                pronunciation: "/ˈeləkwənt/",
                status: "new"
            }
        ];
    }
};
