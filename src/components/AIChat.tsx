import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Bot, Send, Sparkles, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguage } from './LanguageContext';

type LocalizedText = {
  hi: string;
  en: string;
};

type ChatLink = {
  to: string;
  label: LocalizedText;
};

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  links?: ChatLink[];
};

type ResponseTemplate = {
  keywords: string[];
  text: LocalizedText;
  links: ChatLink[];
};

const responseTemplates: ResponseTemplate[] = [
  {
    keywords: ['disease', 'pest', 'blight', 'fungus', 'रोग', 'बीमारी', 'कीट'],
    text: {
      hi: 'फसल की बीमारी के लिए फोटो अपलोड करें और लक्षण लिखें। मैं उपचार के अगले कदम बता सकता हूं।',
      en: 'For crop diseases, upload a clear plant photo and note symptoms. I can guide you with next treatment steps.',
    },
    links: [
      {
        to: `${createPageUrl('Dashboard')}#disease-diagnosis`,
        label: { hi: 'डैशबोर्ड रोग जांच कार्ड', en: 'Open Dashboard Diagnosis Card' },
      },
      {
        to: createPageUrl('CropDiagnosis'),
        label: { hi: 'विस्तृत फसल निदान खोलें', en: 'Open Detailed Crop Diagnosis' },
      },
    ],
  },
  {
    keywords: ['price', 'market', 'mandi', 'rate', 'भाव', 'मंडी', 'दाम'],
    text: {
      hi: 'आज के मंडी भाव देखने के लिए अपनी फसल और राज्य चुनें। मैं बेहतर मंडी चुनने में मदद कर सकता हूं।',
      en: 'To check today\'s mandi prices, select your crop and state. I can help compare better market options.',
    },
    links: [
      {
        to: createPageUrl('MandiPrices'),
        label: { hi: 'मंडी भाव देखें', en: 'Check Mandi Prices' },
      },
      {
        to: createPageUrl('Dashboard'),
        label: { hi: 'डैशबोर्ड पर जाएं', en: 'Go to Dashboard' },
      },
    ],
  },
  {
    keywords: ['weather', 'rain', 'temperature', 'irrigation', 'मौसम', 'बारिश', 'सिंचाई'],
    text: {
      hi: 'मौसम के आधार पर सिंचाई और स्प्रे का समय तय करें। अगले 5 दिनों का पूर्वानुमान जरूर देखें।',
      en: 'Plan irrigation and spraying based on weather windows. Check the next 5-day forecast before field work.',
    },
    links: [
      {
        to: createPageUrl('Weather'),
        label: { hi: 'मौसम पूर्वानुमान खोलें', en: 'Open Weather Forecast' },
      },
      {
        to: createPageUrl('Dashboard'),
        label: { hi: 'मौसम कार्ड देखें', en: 'Open Dashboard Weather' },
      },
    ],
  },
  {
    keywords: ['scheme', 'subsidy', 'loan', 'insurance', 'योजना', 'सब्सिडी', 'लोन', 'बीमा'],
    text: {
      hi: 'आपके राज्य की योजनाएं देखने के लिए फसल और क्षेत्र चुनें। पात्रता और लाभ की जानकारी तुरंत मिलेगी।',
      en: 'Select your state and crop to discover relevant schemes. You can quickly review eligibility and benefits.',
    },
    links: [
      {
        to: createPageUrl('GovtSchemes'),
        label: { hi: 'सरकारी योजनाएं खोलें', en: 'Open Govt Schemes' },
      },
      {
        to: createPageUrl('Dashboard'),
        label: { hi: 'डैशबोर्ड योजनाएं देखें', en: 'View Dashboard Schemes' },
      },
    ],
  },
  {
    keywords: ['crop', 'seed', 'variety', 'soil', 'फसल', 'बीज', 'मिट्टी'],
    text: {
      hi: 'राज्य और मौसम के अनुसार फसल सिफारिश देखना बेहतर रहेगा। मैं आपकी खेती के लिए शुरुआती विकल्प सुझा सकता हूं।',
      en: 'Crop recommendations by state and season will help narrow options. I can suggest starting choices for your farm.',
    },
    links: [
      {
        to: createPageUrl('Dashboard'),
        label: { hi: 'फसल सिफारिश कार्ड देखें', en: 'View Crop Recommendation' },
      },
      {
        to: createPageUrl('Weather'),
        label: { hi: 'मौसम से मिलान करें', en: 'Match with Weather' },
      },
    ],
  },
];

const fallbackResponse: LocalizedText = {
  hi: 'मैं आपकी मदद के लिए तैयार हूं। रोग, मंडी भाव, मौसम, योजनाएं या फसल योजना में से कुछ पूछें।',
  en: 'I am ready to help. Ask about diseases, mandi prices, weather, schemes, or crop planning.',
};

const quickPrompts: LocalizedText[] = [
  {
    hi: 'मेरी फसल में पत्तियां पीली हो रही हैं, क्या करें?',
    en: 'Leaves on my crop are turning yellow. What should I do?',
  },
  {
    hi: 'आज गेहूं का मंडी भाव कैसे देखें?',
    en: 'How can I check today\'s wheat mandi prices?',
  },
  {
    hi: 'बारिश से पहले स्प्रे करना सही है?',
    en: 'Is it safe to spray before rainfall?',
  },
];

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
  typing: { hi: 'AI जवाब लिख रहा है...', en: 'AI is typing a response...' },
  intro: {
    hi: 'नमस्ते किसान मित्र, मैं आपकी खेती से जुड़ी समस्याओं में मदद कर सकता हूं।',
    en: 'Hello farmer, I can help with your crop and market decisions.',
  },
};

const getText = (value: LocalizedText, language: 'hi' | 'en') => value[language];

const buildAssistantReply = (input: string, language: 'hi' | 'en') => {
  const normalizedInput = input.toLowerCase();
  const match = responseTemplates.find((template) =>
    template.keywords.some((keyword) => normalizedInput.includes(keyword))
  );

  if (match) {
    return {
      text: getText(match.text, language),
      links: match.links,
    };
  }

  return {
    text: getText(fallbackResponse, language),
    links: [
      {
        to: `${createPageUrl('Dashboard')}#disease-diagnosis`,
        label: { hi: 'रोग जांच', en: 'Disease Check' },
      },
      {
        to: createPageUrl('MandiPrices'),
        label: { hi: 'मंडी भाव', en: 'Market Prices' },
      },
      {
        to: createPageUrl('Weather'),
        label: { hi: 'मौसम', en: 'Weather' },
      },
    ],
  };
};

export default function AIChat() {
  const { language } = useLanguage();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'intro-assistant',
      role: 'assistant',
      text: getText(uiText.intro, getInitialLanguage()),
    },
  ]);
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<number | null>(null);

  const localizedQuickPrompts = useMemo(
    () => quickPrompts.map((prompt) => getText(prompt, language)),
    [language]
  );

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const sendMessage = (value: string) => {
    const trimmedValue = value.trim();
    if (!trimmedValue || isTyping) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmedValue,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const assistantReply = buildAssistantReply(trimmedValue, language);

    typingTimeoutRef.current = window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          text: assistantReply.text,
          links: assistantReply.links,
        },
      ]);
      setIsTyping(false);
    }, 650);
  };

  return (
    <Card className="border-0 shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold">{getText(uiText.title, language)}</h2>
            <p className="text-sm text-emerald-100">{getText(uiText.subtitle, language)}</p>
          </div>
        </div>
      </div>

      <CardContent className="p-0">
        <div className="h-[430px] overflow-y-auto bg-gradient-to-b from-slate-50 to-white px-4 py-5 space-y-4">
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
                        {getText(link.label, language)}
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
              <span>{getText(uiText.typing, language)}</span>
            </div>
          )}
          <div ref={scrollAnchorRef} />
        </div>

        <div className="border-t border-gray-100 px-4 py-4 bg-white space-y-3">
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">{getText(uiText.quickAsk, language)}</p>
            <div className="flex flex-wrap gap-2">
              {localizedQuickPrompts.map((prompt, index) => (
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
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  sendMessage(input);
                }
              }}
              placeholder={getText(uiText.placeholder, language)}
              className="rounded-xl"
            />
            <Button
              onClick={() => sendMessage(input)}
              disabled={isTyping || input.trim().length === 0}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700"
            >
              <Send className="w-4 h-4 mr-1" />
              {getText(uiText.send, language)}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getInitialLanguage(): 'hi' | 'en' {
  if (typeof window === 'undefined') return 'hi';
  const stored = window.localStorage.getItem('kisanmitra_language');
  return stored === 'en' ? 'en' : 'hi';
}
