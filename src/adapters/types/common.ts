export type SupportedLanguage = 'hi' | 'en';

export type LocalizedText = {
    hi: string;
    en: string;
};

export const getLocalizedText = (text: LocalizedText, language: SupportedLanguage) =>
    text[language] || text.en;
