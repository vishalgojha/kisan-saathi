import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Sprout, TrendingUp, CloudRain, BookOpen, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LanguageProvider, useLanguage } from '../components/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import { base44 } from '@/api/base44Client';

function HomeContent() {
    const { language } = useLanguage();
    
    const content = {
        title: {
            hi: 'किसान मित्र',
            en: 'KisanMitra'
        },
        subtitle: {
            hi: 'आपका व्हाट्सएप पर खेती का साथी',
            en: 'Your WhatsApp Farming Companion'
        },
        description: {
            hi: 'फसल की सलाह, मंडी के रेट, मौसम की जानकारी - सब कुछ एक ही जगह',
            en: 'Crop advice, market rates, weather info - all in one place'
        },
        whatsappBtn: {
            hi: '💬 व्हाट्सएप पर शुरू करें',
            en: '💬 Start on WhatsApp'
        },
        webBtn: {
            hi: '🌐 वेब पर चैट करें',
            en: '🌐 Chat on Web'
        },
        featuresTitle: {
            hi: 'हम आपकी कैसे मदद करते हैं',
            en: 'How We Help You'
        },
        features: [
            {
                icon: Sprout,
                title: { hi: 'फसल सलाह', en: 'Expert Crop Advisory' },
                desc: { hi: 'फोटो से बीमारी पहचान, दवा और सटीक खुराक', en: 'Photo diagnosis, treatments & precise dosages' }
            },
            {
                icon: TrendingUp,
                title: { hi: 'मंडी रेट', en: 'Mandi Rates' },
                desc: { hi: 'आज के ताज़ा भाव और सबसे अच्छा बाजार', en: 'Latest prices & best markets' }
            },
            {
                icon: CloudRain,
                title: { hi: 'मौसम अपडेट', en: 'Weather Updates' },
                desc: { hi: 'बारिश की भविष्यवाणी और खेती कैलेंडर', en: 'Rain forecast & farming calendar' }
            },
            {
                icon: BookOpen,
                title: { hi: 'सरकारी योजनाएं', en: 'Govt Schemes' },
                desc: { hi: 'सब्सिडी, लोन और योजनाओं की जानकारी', en: 'Subsidy, loans & scheme information' }
            }
        ],
        howItWorks: {
            hi: 'कैसे काम करता है',
            en: 'How It Works'
        },
        steps: [
            {
                title: { hi: '1. व्हाट्सएप से जुड़ें', en: '1. Connect WhatsApp' },
                desc: { hi: 'एक क्लिक में अपने व्हाट्सएप से जुड़ें', en: 'Connect your WhatsApp in one click' }
            },
            {
                title: { hi: '2. सवाल पूछें', en: '2. Ask Questions' },
                desc: { hi: 'हिंदी या अंग्रेजी में कुछ भी पूछें', en: 'Ask anything in Hindi or English' }
            },
            {
                title: { hi: '3. तुरंत जवाब पाएं', en: '3. Get Instant Answers' },
                desc: { hi: 'AI से तुरंत सटीक जानकारी', en: 'Get accurate info instantly from AI' }
            }
        ],
        cta: {
            hi: 'आज ही शुरू करें',
            en: 'Start Today'
        }
    };

    const getText = (obj) => obj[language];

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-amber-50">
            {/* Header */}
            <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center">
                            <Sprout className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-green-800">{getText(content.title)}</h1>
                            <p className="text-xs text-green-600">{getText(content.subtitle)}</p>
                        </div>
                    </div>
                    <LanguageToggle />
                </div>
            </header>

            {/* Hero Section */}
            <section className="container mx-auto px-4 py-16 text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        {getText(content.title)}
                    </h2>
                    <p className="text-xl text-gray-600 mb-8">
                        {getText(content.description)}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <a 
                            href={base44.agents.getWhatsAppConnectURL('KisanMitra')} 
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-8 py-6 w-full sm:w-auto">
                                {getText(content.whatsappBtn)}
                            </Button>
                        </a>
                        <Link to="/Chat">
                            <Button size="lg" variant="outline" className="border-green-600 text-green-700 hover:bg-green-50 text-lg px-8 py-6 w-full sm:w-auto">
                                {getText(content.webBtn)}
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Hero Image/Illustration */}
                <div className="mt-12 max-w-2xl mx-auto">
                    <div className="bg-gradient-to-br from-green-100 to-amber-100 rounded-2xl p-8 border-4 border-green-200">
                        <img 
                            src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800" 
                            alt="Indian Farmer" 
                            className="rounded-xl w-full shadow-lg"
                        />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-4 py-16">
                <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">
                    {getText(content.featuresTitle)}
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {content.features.map((feature, idx) => (
                        <Card key={idx} className="border-green-200 hover:shadow-lg transition-shadow">
                            <CardContent className="p-6 text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <feature.icon className="w-8 h-8 text-green-600" />
                                </div>
                                <h4 className="font-bold text-lg mb-2">{getText(feature.title)}</h4>
                                <p className="text-gray-600 text-sm">{getText(feature.desc)}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* How It Works */}
            <section className="bg-white py-16">
                <div className="container mx-auto px-4">
                    <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">
                        {getText(content.howItWorks)}
                    </h3>
                    <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        {content.steps.map((step, idx) => (
                            <div key={idx} className="text-center">
                                <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                                    {idx + 1}
                                </div>
                                <h4 className="font-bold text-xl mb-2">{getText(step.title)}</h4>
                                <p className="text-gray-600">{getText(step.desc)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-green-600 to-green-700 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h3 className="text-3xl font-bold text-white mb-4">
                        {getText(content.cta)}
                    </h3>
                    <p className="text-green-100 text-lg mb-8">
                        {language === 'hi' ? 'लाखों किसान पहले से जुड़े हैं' : 'Join millions of farmers already connected'}
                    </p>
                    <a 
                        href={base44.agents.getWhatsAppConnectURL('KisanMitra')} 
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                            <Phone className="mr-2" />
                            {getText(content.whatsappBtn)}
                        </Button>
                    </a>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 py-8">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-sm">
                        {language === 'hi' ? '© 2024 किसान मित्र - भारतीय किसानों के लिए' : '© 2024 KisanMitra - For Indian Farmers'}
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default function Home() {
    return (
        <LanguageProvider>
            <HomeContent />
        </LanguageProvider>
    );
}