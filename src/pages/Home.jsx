import React, { useEffect, useRef } from 'react';
import { Sprout, TrendingUp, CloudRain, BookOpen, Phone, Camera, ArrowRight, Leaf, Sun, Droplets, MessageCircle, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LanguageProvider, useLanguage } from '../components/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function HomeContent() {
    const { language } = useLanguage();
    const heroRef = useRef(null);
    const featuresRef = useRef(null);
    const statsRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero animations
            gsap.from('.hero-title', {
                y: 60,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            });
            gsap.from('.hero-subtitle', {
                y: 40,
                opacity: 0,
                duration: 1,
                delay: 0.2,
                ease: 'power3.out'
            });
            gsap.from('.hero-cta', {
                y: 30,
                opacity: 0,
                duration: 0.8,
                delay: 0.4,
                ease: 'power3.out'
            });
            gsap.from('.hero-image', {
                scale: 0.9,
                opacity: 0,
                duration: 1.2,
                delay: 0.3,
                ease: 'power3.out'
            });

            // Floating elements
            gsap.to('.float-1', {
                y: -15,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
            gsap.to('.float-2', {
                y: -20,
                duration: 2.5,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: 0.5
            });
            gsap.to('.float-3', {
                y: -12,
                duration: 1.8,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: 1
            });
        }, heroRef);

        return () => ctx.revert();
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.feature-card', {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: featuresRef.current,
                    start: 'top 80%'
                }
            });
        }, featuresRef);

        return () => ctx.revert();
    }, []);

    const content = {
        title: {
            hi: 'किसान साथी',
            en: 'Kisan Saathi'
        },
        tagline: {
            hi: 'खेती में आपका विश्वसनीय साथी',
            en: 'Your Trusted Partner in Farming'
        },
        subtitle: {
            hi: 'AI-संचालित फसल सलाह • लाइव मंडी भाव • मौसम अलर्ट',
            en: 'AI-Powered Crop Advisory • Live Mandi Prices • Weather Alerts'
        },
        whatsappBtn: {
            hi: 'व्हाट्सएप पर शुरू करें',
            en: 'Start on WhatsApp'
        },
        exploreBtn: {
            hi: 'सुविधाएं देखें',
            en: 'Explore Features'
        },
        featuresTitle: {
            hi: 'स्मार्ट खेती के लिए स्मार्ट टूल्स',
            en: 'Smart Tools for Smart Farming'
        },
        features: [
            {
                icon: Camera,
                title: { hi: 'AI फसल डॉक्टर', en: 'AI Crop Doctor' },
                desc: { hi: 'फोटो भेजें, सेकंड में जानें बीमारी और इलाज', en: 'Send photo, get instant diagnosis & treatment' },
                page: 'CropDiagnosis',
                gradient: 'from-emerald-500 to-teal-600',
                bgGradient: 'from-emerald-50 to-teal-50',
                iconBg: 'bg-emerald-100'
            },
            {
                icon: TrendingUp,
                title: { hi: 'लाइव मंडी भाव', en: 'Live Mandi Prices' },
                desc: { hi: 'रियल-टाइम रेट, बेस्ट मंडी सुझाव', en: 'Real-time rates, best mandi suggestions' },
                page: 'MandiPrices',
                gradient: 'from-amber-500 to-orange-600',
                bgGradient: 'from-amber-50 to-orange-50',
                iconBg: 'bg-amber-100'
            },
            {
                icon: CloudRain,
                title: { hi: 'मौसम इंटेलिजेंस', en: 'Weather Intelligence' },
                desc: { hi: '5-दिन पूर्वानुमान, सिंचाई व स्प्रे सलाह', en: '5-day forecast, irrigation & spray advice' },
                page: 'Weather',
                gradient: 'from-sky-500 to-blue-600',
                bgGradient: 'from-sky-50 to-blue-50',
                iconBg: 'bg-sky-100'
            },
            {
                icon: BookOpen,
                title: { hi: 'सरकारी योजनाएं', en: 'Govt Schemes' },
                desc: { hi: 'सब्सिडी, लोन, बीमा - पूरी जानकारी', en: 'Subsidies, loans, insurance - complete info' },
                page: 'GovtSchemes',
                gradient: 'from-violet-500 to-purple-600',
                bgGradient: 'from-violet-50 to-purple-50',
                iconBg: 'bg-violet-100'
            }
        ],
        stats: [
            { value: '10L+', label: { hi: 'किसान जुड़े', en: 'Farmers Connected' } },
            { value: '50+', label: { hi: 'फसलें', en: 'Crops Covered' } },
            { value: '500+', label: { hi: 'मंडियां', en: 'Mandis Tracked' } },
            { value: '24/7', label: { hi: 'सहायता', en: 'Support' } }
        ],
        howItWorks: {
            hi: 'कैसे काम करता है',
            en: 'How It Works'
        },
        steps: [
            {
                num: '01',
                title: { hi: 'कनेक्ट करें', en: 'Connect' },
                desc: { hi: 'व्हाट्सएप पर एक क्लिक में जुड़ें', en: 'Join via WhatsApp in one click' }
            },
            {
                num: '02',
                title: { hi: 'पूछें', en: 'Ask' },
                desc: { hi: 'हिंदी या अंग्रेजी में सवाल पूछें', en: 'Ask questions in Hindi or English' }
            },
            {
                num: '03',
                title: { hi: 'जवाब पाएं', en: 'Get Answers' },
                desc: { hi: 'AI से तुरंत विशेषज्ञ सलाह', en: 'Get instant expert advice from AI' }
            }
        ]
    };

    const getText = (obj) => obj[language];

    return (
        <div className="min-h-screen bg-[#FAFAF8] overflow-hidden">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20">
                                <Sprout className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                                    {getText(content.title)}
                                </h1>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <LanguageToggle />
                            <Button 
                                onClick={() => base44.auth.redirectToLogin(window.location.href)}
                                variant="outline" 
                                className="rounded-xl px-5 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                            >
                                {language === 'hi' ? 'लॉगिन' : 'Login'}
                            </Button>
                            <Link to={createPageUrl('Dashboard')} className="hidden md:block">
                                <Button variant="outline" className="rounded-xl px-5 border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                                    <LayoutDashboard className="w-4 h-4 mr-2" />
                                    {language === 'hi' ? 'डैशबोर्ड' : 'Dashboard'}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section ref={heroRef} className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-green-200/30 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-green-100/20 to-emerald-100/20 rounded-full blur-3xl" />
                </div>

                {/* Floating Icons */}
                <div className="absolute top-32 left-[10%] float-1 hidden lg:block">
                    <div className="w-14 h-14 bg-white rounded-2xl shadow-xl flex items-center justify-center">
                        <Leaf className="w-7 h-7 text-green-500" />
                    </div>
                </div>
                <div className="absolute top-48 right-[15%] float-2 hidden lg:block">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center">
                        <Sun className="w-6 h-6 text-amber-500" />
                    </div>
                </div>
                <div className="absolute bottom-32 left-[20%] float-3 hidden lg:block">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-xl flex items-center justify-center">
                        <Droplets className="w-5 h-5 text-blue-500" />
                    </div>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="hero-title">
                            <span className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-6">
                                🌾 {language === 'hi' ? 'भारत का #1 कृषि AI' : "India's #1 Agri AI"}
                            </span>
                            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-4">
                                {getText(content.tagline)}
                            </h2>
                        </div>
                        <p className="hero-subtitle text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                            {getText(content.subtitle)}
                        </p>
                        <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center">
                            <a 
                                href={base44.agents.getWhatsAppConnectURL('KisanSaathi')} 
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-lg px-8 py-6 rounded-2xl shadow-xl shadow-green-500/25 transition-all hover:shadow-2xl hover:shadow-green-500/30 hover:-translate-y-0.5">
                                    <MessageCircle className="w-5 h-5 mr-2" />
                                    {getText(content.whatsappBtn)}
                                </Button>
                            </a>
                            <Button 
                                size="lg" 
                                variant="outline" 
                                className="w-full sm:w-auto text-lg px-8 py-6 rounded-2xl border-2 hover:bg-gray-50"
                                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                {getText(content.exploreBtn)}
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div className="hero-image mt-16 max-w-4xl mx-auto">
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-gray-900/10">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
                            <img 
                                src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&q=80" 
                                alt="Indian Farmer" 
                                className="w-full h-[300px] md:h-[500px] object-cover"
                            />
                            <div className="absolute bottom-6 left-6 right-6 z-20">
                                <div className="flex gap-3 flex-wrap">
                                    {content.stats.map((stat, idx) => (
                                        <div key={idx} className="bg-white/95 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-lg">
                                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                            <p className="text-sm text-gray-600">{getText(stat.label)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" ref={featuresRef} className="py-20 md:py-32 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h3 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                            {getText(content.featuresTitle)}
                        </h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        {content.features.map((feature, idx) => (
                            <Link key={idx} to={createPageUrl(feature.page)} className="feature-card group">
                                <Card className={`relative overflow-hidden border-0 shadow-lg shadow-gray-200/50 hover:shadow-2xl hover:shadow-gray-300/50 transition-all duration-500 hover:-translate-y-1 bg-gradient-to-br ${feature.bgGradient} h-full`}>
                                    <CardContent className="p-8">
                                        <div className={`w-16 h-16 ${feature.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                            <feature.icon className={`w-8 h-8 bg-gradient-to-r ${feature.gradient} bg-clip-text`} style={{ color: feature.gradient.includes('emerald') ? '#10b981' : feature.gradient.includes('amber') ? '#f59e0b' : feature.gradient.includes('sky') ? '#0ea5e9' : '#8b5cf6' }} />
                                        </div>
                                        <h4 className="text-2xl font-bold text-gray-900 mb-3">{getText(feature.title)}</h4>
                                        <p className="text-gray-600 text-lg mb-6">{getText(feature.desc)}</p>
                                        <div className={`inline-flex items-center text-sm font-semibold bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                                            {language === 'hi' ? 'अभी देखें' : 'Explore Now'}
                                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" style={{ color: feature.gradient.includes('emerald') ? '#10b981' : feature.gradient.includes('amber') ? '#f59e0b' : feature.gradient.includes('sky') ? '#0ea5e9' : '#8b5cf6' }} />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 md:py-32 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-green-500/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
                </div>
                
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <h3 className="text-3xl md:text-5xl font-bold mb-4">
                            {getText(content.howItWorks)}
                        </h3>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {content.steps.map((step, idx) => (
                            <div key={idx} className="text-center group">
                                <div className="relative mb-8">
                                    <span className="text-8xl font-bold text-white/5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                        {step.num}
                                    </span>
                                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto relative shadow-xl shadow-green-500/25 group-hover:scale-110 transition-transform">
                                        <span className="text-2xl font-bold">{step.num}</span>
                                    </div>
                                </div>
                                <h4 className="text-2xl font-bold mb-3">{getText(step.title)}</h4>
                                <p className="text-gray-400 text-lg">{getText(step.desc)}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-16">
                        <a 
                            href={base44.agents.getWhatsAppConnectURL('KisanSaathi')} 
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 text-lg px-10 py-6 rounded-2xl shadow-xl">
                                <MessageCircle className="w-5 h-5 mr-2" />
                                {getText(content.whatsappBtn)}
                            </Button>
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 py-12">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                                <Sprout className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold text-gray-900">{getText(content.title)}</span>
                        </div>
                        <div className="text-center md:text-left">
                            <p className="text-gray-500 text-sm">
                                {language === 'hi' ? '© 2024 किसान साथी - भारतीय किसानों के लिए बनाया गया' : '© 2024 Kisan Saathi - Made for Indian Farmers'}
                            </p>
                            <p className="text-gray-400 text-xs mt-1">www.kisansaath.life</p>
                        </div>
                        <a href="tel:1800-180-1551" className="flex items-center gap-2 text-green-600 font-medium">
                            <Phone className="w-4 h-4" />
                            1800-180-1551
                        </a>
                    </div>
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