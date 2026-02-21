/**
 * LexiPath Neural Translator Module
 * Handles i18n support for EN/ZH locales.
 */

const translations = {
    zh: {
        // Navigation
        'nav.dashboard': '神经网络仪表盘',
        'nav.manage': '词汇管理中心',
        'nav.settings': '系统设置',
        'nav.logout': '神经断开 (登出)',
        'nav.protocol': '主协议',
        'nav.preferences': '系统偏好',

        // Dashboard/Study
        'study.ignite': '启动学习会话',
        'study.vault': '词汇保险库',
        'study.units_mastered': '个单元已掌握',
        'study.empty_vault': '词汇库为空',
        'study.empty_desc': '通过网络同步或手动添加单元来初始化您的神经数据库。',
        'study.local_import': '本地导入',
        'study.close_session': '关闭会话',
        'study.progression': '进度',
        'study.mastery_achieved': '巅峰掌握',
        'study.mastery_desc': '这就完成了！您对这 {count} 个单词的神经连接已得到强化。',
        'study.return_lexicon': '返回词库',
        'study.reveal_insight': '揭示洞察',
        'study.challenge': '概念挑战',
        'study.learning_mode': '学习模式',
        'study.status_mastered': '已掌握',
        'study.status_acquiring': '习得中',

        // Flashcard Actions
        'action.know': '我掌握了',
        'action.dont_know': '我不清楚',
        'action.new_discovery': '新发现',
        'action.mastery_achieved': '达成掌握',

        // Word Detail Panels
        'detail.header_urgency': '复习紧迫度: {urgency}',
        'detail.urgency_low': '低',
        'detail.urgency_medium': '中',
        'detail.urgency_high': '高',
        'detail.definition': '核心定义',
        'detail.context': '何时使用此词？(社交语境)',
        'detail.synonyms': '相似概念',
        'detail.examples': '影院式用例',
        'detail.media': '媒体学习',
        'detail.media_desc': '观察 "{word}" 在母语者语境中如何使用',
        'detail.ai_enrich': '智能 AI 增强',
        'detail.ai_refresh': '刷新 AI 洞察',
        'detail.ai_loading': 'AI 增强中...',
        'detail.placeholder_pronunciation': '发音加载中...',

        // Media Player
        'media.initialize': '初始化媒体流',
        'media.secure_conn': '需要安全流连接',
        'media.syncing': '神经语境同步中',
        'media.streaming': '正在流式传输影院数据...',
        'media.error': '未找到片段',
        'media.open_youglish': '在 YouGlish 打开',

        // Manage View
        'manage.title': '词汇管理',
        'manage.add_word': '添加新单词',
        'manage.import': '导入',
        'manage.export': '导出',
        'manage.search': '搜索词汇...',
        'manage.bulk_delete': '批量删除',
        'manage.table_word': '单词',
        'manage.table_meaning': '意思',
        'manage.table_status': '状态',
        'manage.table_actions': '操作',

        // Auth
        'auth.welcome': '欢迎回来，执行官',
        'auth.desc': '连接到您的神经学习网络。',
        'auth.email': '神经识别码 (Email)',
        'auth.placeholder_email': '输入您的 Email...',
        'auth.password': '安全密钥',
        'auth.connect': '连接协议',
        'auth.register': '注册',
        'auth.sign_in': '登录',
        'auth.register_title': '新协议',
        'auth.register_desc': '在 LexiPath 生态系统中初始化新的神经路径，开始您的语言进化。',
        'auth.register_action': '建立协议',
        'auth.login': '已有协议？登录',
        'auth.connecting': '正在建立神经连接...',
        'auth.bio_unlock': '生物识别解锁',
        'auth.immersion_desc': 'LexiPath 利用神经同步协议弥合人工智能与人类语言直觉之间的差距。每个单词都是一个新的连接。',
        'auth.ai_assistant': '神经 AI 助手',
        'auth.enrichment_active': '增强引擎已激活',

        // Study (additional)
        'study.vault_lexicon': '词汇库',
        'study.vault_tag': '私人金库',
        'study.mastered_count': '{count} 个单元已掌握',

        // Manage (additional)
        'manage.title_lexicon': '词汇',
        'manage.title_manage': '管理',
        'manage.units_count': '个节点',
        'manage.desc': '管理您的神经数据库并配置语言路径。',
        'manage.bulk_selection': '个节点已选中',
        'manage.syncing': '正在同步本地存储...',
        'manage.empty': '没有匹配到您的搜索词',
        'manage.modal_new': '新节点',
        'manage.modal_desc': '初始化神经连接',
        'manage.modal_word': '目标词汇',
        'manage.modal_word_placeholder': '例如：Scrutiny',
        'manage.confirm_delete': '确定要删除这个神经连接？',
        'manage.confirm_bulk_delete': '确定要删除 {count} 个神经连接？',
        'manage.no_audio': '无音频矩阵',
        'manage.delete': '断开节点',
        'manage.modal_syncing': '同步协议中...',
        'manage.modal_connect': '连接神经路径',

        // Detail (additional)
        'detail.ai_available': 'AI 增强可用',
        'detail.no_segments': '未找到片段',
        'detail.achievement_protocol': '成就协议',
    },
    en: {
        // Navigation
        'nav.dashboard': 'Neural Dashboard',
        'nav.manage': 'Lexicon Manage',
        'nav.settings': 'Neural Settings',
        'nav.logout': 'Neural Disconnect',
        'nav.protocol': 'Main Protocol',
        'nav.preferences': 'System Preferences',

        // Dashboard/Study
        'study.ignite': 'Ignite Session',
        'study.vault': 'Lexicon Vault',
        'study.units_mastered': 'units mastered',
        'study.empty_vault': 'Lexicon Vault Empty',
        'study.empty_desc': 'Initialize your neural database by syncing from the network or adding units manually.',
        'study.local_import': 'Local Import',
        'study.close_session': 'Close Session',
        'study.progression': 'Progression',
        'study.mastery_achieved': 'Peak Mastery',
        'study.mastery_desc': 'Connection complete! Your neural reinforcement for these {count} words is synchronized.',
        'study.return_lexicon': 'Return to Lexicon',
        'study.reveal_insight': 'Reveal Insight',
        'study.challenge': 'Concept Challenge',
        'study.learning_mode': 'Learning Mode',
        'study.status_mastered': 'Mastered',
        'study.status_acquiring': 'Acquiring',

        // Flashcard Actions
        'action.know': 'I got this',
        'action.dont_know': 'I don\'t know',
        'action.new_discovery': 'New Discovery',
        'action.mastery_achieved': 'Mastery Achieved',

        // Word Detail Panels
        'detail.header_urgency': 'Review Urgency: {urgency}',
        'detail.urgency_low': 'Low',
        'detail.urgency_medium': 'Medium',
        'detail.urgency_high': 'High',
        'detail.definition': 'Core Definition',
        'detail.context': 'When to use this? (Social Context)',
        'detail.synonyms': 'Similar Concepts',
        'detail.examples': 'Cinematic Usage',
        'detail.media': 'Learning with Media',
        'detail.media_desc': 'Witness how "{word}" is used in native speaker contexts',
        'detail.ai_enrich': 'Smart Enrich Intelligence',
        'detail.ai_refresh': 'Refresh AI Insights',
        'detail.ai_loading': 'AI Augmenting...',
        'detail.placeholder_pronunciation': 'Loading phonetics...',

        // Media Player
        'media.initialize': 'Initialize Media Protocol',
        'media.secure_conn': 'Secure Streaming Connection Required',
        'media.syncing': 'Neural Context Sync',
        'media.streaming': 'Streaming cinematic data...',
        'media.error': 'No clips found',
        'media.open_youglish': 'Open YouGlish',

        // Manage View
        'manage.title': 'Lexicon Management',
        'manage.add_word': 'Add New Word',
        'manage.import': 'Import',
        'manage.export': 'Export',
        'manage.search': 'Search lexicon...',
        'manage.bulk_delete': 'Bulk Delete',
        'manage.table_word': 'Word',
        'manage.table_meaning': 'Meaning',
        'manage.table_status': 'Status',
        'manage.table_actions': 'Actions',

        // Auth
        'auth.welcome': 'Welcome back, Executive',
        'auth.desc': 'Connect to your neural learning network.',
        'auth.email': 'Neural Identity (Email)',
        'auth.placeholder_email': 'Enter your email...',
        'auth.password': 'Secure Cipher',
        'auth.connect': 'Initialize Connection',
        'auth.register': 'Register',
        'auth.sign_in': 'Sign In',
        'auth.register_title': 'New Protocol',
        'auth.register_desc': 'Initialize a new neural pathway within the LexiPath ecosystem to begin your linguistic evolution.',
        'auth.register_action': 'Establish Protocol',
        'auth.login': 'Existing Protocol? Sign In',
        'auth.connecting': 'Establishing neural link...',
        'auth.bio_unlock': 'Bio-Unlock Method',
        'auth.immersion_desc': 'LexiPath utilizes neural sync protocols to bridge the gap between artificial intelligence and human linguistic intuition. Every word is a new connection.',
        'auth.ai_assistant': 'Neural AI Assistant',
        'auth.enrichment_active': 'Enrichment Engine Active',

        // Study (additional)
        'study.vault_lexicon': 'Lexicon',
        'study.vault_tag': 'vault',
        'study.mastered_count': '{count} units mastered',

        // Manage (additional)
        'manage.title_lexicon': 'Lexicon',
        'manage.title_manage': 'Manage',
        'manage.units_count': 'NODES',
        'manage.desc': 'Administer your neural database and configure linguistic pathways.',
        'manage.bulk_selection': 'Nodes Selected',
        'manage.syncing': 'Synchronizing Local Storage...',
        'manage.empty': 'No neural nodes matched your frequency',
        'manage.modal_new': 'New Node',
        'manage.modal_desc': 'Initialize neural connection',
        'manage.modal_word': 'Linguistic Target (Word)',
        'manage.modal_word_placeholder': 'e.g. Scrutiny',
        'manage.confirm_delete': 'Erase this neural connection?',
        'manage.confirm_bulk_delete': 'Erase {count} neural connections?',
        'manage.no_audio': 'No Audio Matrix',
        'manage.delete': 'Disconnect Node',
        'manage.modal_syncing': 'Synchronizing Protocol...',
        'manage.modal_connect': 'Connect Neural Path',

        // Detail (additional)
        'detail.ai_available': 'AI Augmentation Available',
        'detail.no_segments': 'No segments found',
        'detail.achievement_protocol': 'Achievement Protocol',
    }
};

export const LocalizationAgent = {
    get: (key, lang = 'zh', params = {}) => {
        let text = translations[lang]?.[key] || translations['en']?.[key] || key;

        // Replace parameters like {word} or {count}
        Object.keys(params).forEach(p => {
            text = text.replace(`{${p}}`, params[p]);
        });

        return text;
    },

    // Helper for complex components
    t: (lang) => (key, params) => LocalizationAgent.get(key, lang, params)
};
