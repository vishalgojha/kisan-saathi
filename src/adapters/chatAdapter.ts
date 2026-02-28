import { appClient } from '@/api/appClient';
import { createPageUrl } from '@/utils';
import { getDataMode } from './dataMode';
import type { LocalizedText, SupportedLanguage } from './types/common';
import { getLocalizedText } from './types/common';

export type ChatLink = {
    to: string;
    label: LocalizedText;
};

export type ChatReply = {
    text: LocalizedText;
    links: ChatLink[];
};

type ChatTemplate = {
    keywords: string[];
    reply: ChatReply;
};

export type ChatRequest = {
    message: string;
    language: SupportedLanguage;
};

export interface ChatAdvisorAdapter {
    getReply: (request: ChatRequest) => Promise<ChatReply>;
}

const fallbackLinks: ChatLink[] = [
    {
        to: `${createPageUrl('Dashboard')}#disease-diagnosis`,
        label: { hi: 'डैशबोर्ड रोग जांच', en: 'Dashboard Disease Check' },
    },
    {
        to: `${createPageUrl('Dashboard')}#market-prices`,
        label: { hi: 'डैशबोर्ड मंडी भाव', en: 'Dashboard Mandi Prices' },
    },
    {
        to: createPageUrl('Weather'),
        label: { hi: 'मौसम पूर्वानुमान', en: 'Weather Forecast' },
    },
];

const chatTemplates: ChatTemplate[] = [
    {
        keywords: ['disease', 'pest', 'blight', 'fungus', 'रोग', 'बीमारी', 'कीट'],
        reply: {
            text: {
                hi: 'फोटो और लक्षण देकर रोग जांच शुरू करें। मैं उपचार के अगले कदम भी सुझाऊंगा।',
                en: 'Start diagnosis with photo and symptoms. I can suggest the next treatment steps.',
            },
            links: [
                {
                    to: `${createPageUrl('Dashboard')}#disease-diagnosis`,
                    label: { hi: 'डैशबोर्ड रोग जांच कार्ड', en: 'Open Dashboard Diagnosis Card' },
                },
                {
                    to: createPageUrl('CropDiagnosis'),
                    label: { hi: 'विस्तृत रोग निदान', en: 'Open Detailed Crop Diagnosis' },
                },
            ],
        },
    },
    {
        keywords: ['price', 'market', 'mandi', 'rate', 'भाव', 'मंडी', 'दाम'],
        reply: {
            text: {
                hi: 'राज्य, फसल और मंडी चुनकर आज का भाव और साप्ताहिक ट्रेंड देखें।',
                en: 'Select state, crop, and mandi to review today rates and weekly trend.',
            },
            links: [
                {
                    to: `${createPageUrl('Dashboard')}#market-prices`,
                    label: { hi: 'मार्केट प्राइस कार्ड', en: 'Open Market Prices Card' },
                },
                {
                    to: createPageUrl('MandiPrices'),
                    label: { hi: 'विस्तृत मंडी पेज', en: 'Open Mandi Prices Page' },
                },
            ],
        },
    },
    {
        keywords: ['weather', 'rain', 'irrigation', 'मौसम', 'बारिश', 'सिंचाई'],
        reply: {
            text: {
                hi: 'अगले 5 दिनों की बारिश संभावना देखकर सिंचाई और स्प्रे का समय तय करें।',
                en: 'Plan irrigation and spraying after checking 5-day rain probability.',
            },
            links: [
                {
                    to: createPageUrl('Weather'),
                    label: { hi: 'मौसम पूर्वानुमान खोलें', en: 'Open Weather Forecast' },
                },
                {
                    to: createPageUrl('Dashboard'),
                    label: { hi: 'डैशबोर्ड पर जाएं', en: 'Go to Dashboard' },
                },
            ],
        },
    },
    {
        keywords: ['scheme', 'subsidy', 'insurance', 'योजना', 'सब्सिडी', 'बीमा'],
        reply: {
            text: {
                hi: 'अपने राज्य के लिए योजनाएं देखें और पात्रता दस्तावेज पहले तैयार रखें।',
                en: 'Review schemes for your state and keep eligibility documents ready.',
            },
            links: [
                {
                    to: createPageUrl('GovtSchemes'),
                    label: { hi: 'सरकारी योजनाएं', en: 'Open Govt Schemes' },
                },
                {
                    to: createPageUrl('Dashboard'),
                    label: { hi: 'डैशबोर्ड योजनाएं', en: 'Dashboard Schemes' },
                },
            ],
        },
    },
];

const fallbackReply: LocalizedText = {
    hi: 'मैं रोग जांच, मंडी भाव, मौसम और योजनाओं में मदद कर सकता हूं।',
    en: 'I can help with disease diagnosis, mandi prices, weather, and schemes.',
};

const mockAdapter: ChatAdvisorAdapter = {
    async getReply(request) {
        const normalizedMessage = request.message.toLowerCase();
        const match = chatTemplates.find((template) =>
            template.keywords.some((keyword) => normalizedMessage.includes(keyword))
        );

        if (match) return match.reply;
        return {
            text: fallbackReply,
            links: fallbackLinks,
        };
    },
};

const parseLiveLinks = (rawLinks: unknown): ChatLink[] => {
    if (!Array.isArray(rawLinks)) return [];
    const normalized = rawLinks
        .map((item) => {
            const link = item as Record<string, unknown>;
            const to = String(link?.to || link?.url || '').trim();
            const labelEn = String(link?.label_en || link?.label || '').trim();
            const labelHi = String(link?.label_hi || link?.label || '').trim();
            if (!to || !labelEn) return null;
            return {
                to,
                label: { hi: labelHi || labelEn, en: labelEn },
            } as ChatLink;
        })
        .filter(Boolean) as ChatLink[];
    return normalized;
};

const liveAdapter: ChatAdvisorAdapter = {
    async getReply(request) {
        const prompt = `You are an Indian farming assistant. Answer briefly.
User question: ${request.message}
Return JSON with keys: reply_en, reply_hi, links (array of {to,label_en,label_hi}).`;

        const response = (await appClient.integrations.Core.InvokeLLM({
            prompt,
            response_json_schema: {
                type: 'object',
                properties: {
                    reply_en: { type: 'string' },
                    reply_hi: { type: 'string' },
                    links: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                to: { type: 'string' },
                                label_en: { type: 'string' },
                                label_hi: { type: 'string' },
                            },
                        },
                    },
                },
            },
        })) as Record<string, unknown>;

        const replyEn = String(response?.reply_en || response?.message_en || '').trim();
        const replyHi = String(response?.reply_hi || response?.message_hi || '').trim();
        const links = parseLiveLinks(response?.links);

        if (!replyEn && !replyHi) {
            throw new Error('No response from live advisory service');
        }

        return {
            text: {
                en: replyEn || replyHi,
                hi: replyHi || replyEn,
            },
            links: links.length > 0 ? links : fallbackLinks,
        };
    },
};

export const createChatAdapter = (): ChatAdvisorAdapter => {
    if (getDataMode() === 'live') return liveAdapter;
    return mockAdapter;
};

export const getDefaultIntroText = (language: SupportedLanguage) =>
    getLocalizedText(
        {
            hi: 'नमस्ते किसान मित्र, खेती से जुड़े सवाल पूछें और मैं सही मॉड्यूल तक पहुंचने में मदद करूंगा।',
            en: 'Hello farmer, ask any farming question and I will guide you to the right module.',
        },
        language
    );
