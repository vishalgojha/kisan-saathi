import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, Bot, RotateCcw, Send, Sparkles, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createChatAdapter, getDefaultIntroText } from '@/adapters/chatAdapter';
import { getLocalizedText, type SupportedLanguage } from '@/adapters/types/common';
import { useLanguage } from './LanguageContext';

type ChatMessage = {
    id: string;
    role: 'user' | 'assistant';
    text: string;
    links?: Array<{ to: string; label: { hi: string; en: string } }>;
};

const quickPrompts = {
    hi: [
        'मेरी फसल में पत्तियां पीली हो रही हैं, क्या करें?',
        'आज गेहूं का मंडी भाव कैसे देखें?',
        'बारिश से पहले स्प्रे करना सही है?',
    ],
    en: [
        'Leaves on my crop are turning yellow. What should I do?',
        'How can I check today wheat mandi prices?',
        'Is it safe to spray before rainfall?',
    ],
};

const uiText = {
    title: { hi: 'AI कृषि सलाह चैट', en: 'AI Farming Advisory Chat' },
    subtitle: {
        hi: 'रोग, भाव, मौसम और योजनाओं पर तुरंत मार्गदर्शन',
        en: 'Instant guidance on disease, prices, weather, and schemes',
    },
    placeholder: {
        hi: 'अपना सवाल लिखें...',
        en: 'Type your farming question...',
    },
    send: { hi: 'भेजें', en: 'Send' },
    quickAsk: { hi: 'जल्दी पूछें', en: 'Quick Ask' },
    typing: { hi: 'AI जवाब तैयार कर रहा है...', en: 'AI is preparing a response...' },
    validationShort: {
        hi: 'कम से कम 3 अक्षरों का सवाल लिखें।',
        en: 'Please enter at least 3 characters.',
    },
    validationLong: {
        hi: 'सवाल 280 अक्षरों से कम रखें।',
        en: 'Keep the question under 280 characters.',
    },
    serviceError: {
        hi: 'अभी जवाब नहीं मिल पाया। दोबारा प्रयास करें।',
        en: 'Unable to get a response right now. Please retry.',
    },
    retry: { hi: 'फिर से कोशिश करें', en: 'Retry' },
};

const asLanguage = (value: string): SupportedLanguage => (value === 'en' ? 'en' : 'hi');

export default function AIChat() {
    const { language } = useLanguage();
    const safeLanguage = asLanguage(language);
    const adapter = useMemo(() => createChatAdapter(), []);

    const [input, setInput] = useState('');
    const [inputError, setInputError] = useState('');
    const [serviceError, setServiceError] = useState('');
    const [lastFailedMessage, setLastFailedMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>(() => [
        {
            id: 'intro-assistant',
            role: 'assistant',
            text: getDefaultIntroText(safeLanguage),
        },
    ]);

    const scrollAnchorRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        scrollAnchorRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping, serviceError]);

    const getText = (text: { hi: string; en: string }) => getLocalizedText(text, safeLanguage);

    const validateInput = (value: string) => {
        if (value.length < 3) return getText(uiText.validationShort);
        if (value.length > 280) return getText(uiText.validationLong);
        return '';
    };

    const sendMessage = async (value: string, fromRetry = false) => {
        const trimmed = value.trim();
        const validationError = validateInput(trimmed);
        if (validationError) {
            setInputError(validationError);
            return;
        }

        setInputError('');
        setServiceError('');
        setIsTyping(true);

        if (!fromRetry) {
            setMessages((prev) => [
                ...prev,
                {
                    id: `user-${Date.now()}`,
                    role: 'user',
                    text: trimmed,
                },
            ]);
            setInput('');
        }

        try {
            const reply = await adapter.getReply({
                message: trimmed,
                language: safeLanguage,
            });

            setMessages((prev) => [
                ...prev,
                {
                    id: `assistant-${Date.now()}`,
                    role: 'assistant',
                    text: getLocalizedText(reply.text, safeLanguage),
                    links: reply.links,
                },
            ]);
            setLastFailedMessage('');
        } catch {
            setServiceError(getText(uiText.serviceError));
            setLastFailedMessage(trimmed);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <Card className="border-0 shadow-2xl overflow-hidden" data-testid="ai-chat">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold">{getText(uiText.title)}</h2>
                        <p className="text-sm text-emerald-100">{getText(uiText.subtitle)}</p>
                    </div>
                </div>
            </div>

            <CardContent className="p-0">
                <div
                    className="h-[430px] overflow-y-auto bg-gradient-to-b from-slate-50 to-white px-4 py-5 space-y-4"
                    data-testid="ai-chat-messages"
                >
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {message.role === 'assistant' && (
                                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-1">
                                    <Bot className="w-4 h-4" />
                                </div>
                            )}

                            <div className="max-w-[80%]">
                                <div
                                    className={`rounded-2xl px-4 py-3 text-sm shadow-sm ${
                                        message.role === 'user'
                                            ? 'bg-emerald-600 text-white rounded-br-md'
                                            : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md'
                                    }`}
                                >
                                    {message.text}
                                </div>
                                {message.links && message.links.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {message.links.map((link, index) => (
                                            <Link
                                                key={`${message.id}-link-${index}`}
                                                to={link.to}
                                                className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-full px-3 py-1 transition-colors"
                                            >
                                                {getLocalizedText(link.label, safeLanguage)}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {message.role === 'user' && (
                                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-1">
                                    <User className="w-4 h-4" />
                                </div>
                            )}
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Bot className="w-4 h-4 text-emerald-600" />
                            <span>{getText(uiText.typing)}</span>
                        </div>
                    )}

                    {serviceError && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 flex items-start justify-between gap-2">
                            <span className="inline-flex items-center gap-1">
                                <AlertTriangle className="w-4 h-4 mt-0.5" />
                                {serviceError}
                            </span>
                            {lastFailedMessage && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 rounded-lg"
                                    onClick={() => sendMessage(lastFailedMessage, true)}
                                >
                                    <RotateCcw className="w-3.5 h-3.5 mr-1" />
                                    {getText(uiText.retry)}
                                </Button>
                            )}
                        </div>
                    )}
                    <div ref={scrollAnchorRef} />
                </div>

                <div className="border-t border-gray-100 px-4 py-4 bg-white space-y-3">
                    <div>
                        <p className="text-xs font-semibold text-gray-500 mb-2">{getText(uiText.quickAsk)}</p>
                        <div className="flex flex-wrap gap-2">
                            {quickPrompts[safeLanguage].map((prompt, index) => (
                                <button
                                    key={`prompt-${index}`}
                                    type="button"
                                    onClick={() => sendMessage(prompt)}
                                    className="text-xs border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 text-gray-700 rounded-full px-3 py-1 transition-colors"
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Input
                            value={input}
                            onChange={(event) => {
                                setInput(event.target.value);
                                if (inputError) setInputError('');
                            }}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    sendMessage(input);
                                }
                            }}
                            placeholder={getText(uiText.placeholder)}
                            className="rounded-xl"
                            data-testid="ai-chat-input"
                        />
                        <Button
                            onClick={() => sendMessage(input)}
                            disabled={isTyping || input.trim().length === 0}
                            className="rounded-xl bg-emerald-600 hover:bg-emerald-700"
                            data-testid="ai-chat-send"
                        >
                            <Send className="w-4 h-4 mr-1" />
                            {getText(uiText.send)}
                        </Button>
                    </div>

                    {inputError && <p className="text-xs text-red-600">{inputError}</p>}
                </div>
            </CardContent>
        </Card>
    );
}
