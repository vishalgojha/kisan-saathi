import React from 'react';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import LanguageToggle from '@/components/LanguageToggle';
import { LanguageProvider, useLanguage } from '@/components/LanguageContext';
import AIChat from '@/components/AIChat';

function AIHelpContent() {
    const { language } = useLanguage();

    const content = {
        title: { hi: 'AI सहायता चैट', en: 'AI Help Chat' },
        subtitle: {
            hi: 'कृषि निर्णयों के लिए तुरंत मार्गदर्शन लें',
            en: 'Get instant guidance for critical farm decisions'
        },
        backToDashboard: { hi: 'डैशबोर्ड पर वापस', en: 'Back to Dashboard' }
    };

    const getText = (obj) => obj?.[language] || obj?.en || '';

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <Link
                        to={createPageUrl('Dashboard')}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {getText(content.backToDashboard)}
                    </Link>
                    <LanguageToggle />
                </div>
            </header>

            <main className="container mx-auto px-4 md:px-6 py-8 md:py-10 max-w-5xl">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <HelpCircle className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{getText(content.title)}</h1>
                    <p className="text-gray-600 mt-2">{getText(content.subtitle)}</p>
                </div>

                <AIChat />
            </main>
        </div>
    );
}

export default function AIHelp() {
    return (
        <LanguageProvider>
            <AIHelpContent />
        </LanguageProvider>
    );
}

