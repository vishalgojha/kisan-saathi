import React, { useState, useEffect } from 'react';
import { FileText, Phone, Globe, Search, Loader2, IndianRupee, Calendar, CheckCircle, ArrowLeft, Award, ExternalLink, ChevronDown, Building } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { appClient } from '@/api/appClient';
import { LanguageProvider, useLanguage } from '../components/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import gsap from 'gsap';

function SchemesContent() {
    const { language } = useLanguage();
    const [state, setState] = useState('');
    const [schemeType, setSchemeType] = useState('');
    const [schemesData, setSchemesData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [expandedScheme, setExpandedScheme] = useState(null);

    useEffect(() => {
        if (schemesData) {
            gsap.from('.scheme-card', {
                y: 30,
                opacity: 0,
                duration: 0.5,
                stagger: 0.08,
                ease: 'power3.out'
            });
        }
    }, [schemesData]);

    const content = {
        title: { hi: 'सरकारी योजनाएं', en: 'Government Schemes' },
        subtitle: { hi: 'किसानों के लिए सब्सिडी, लोन और बीमा योजनाएं', en: 'Subsidies, loans & insurance for farmers' },
        state: { hi: 'राज्य चुनें', en: 'Select State' },
        type: { hi: 'योजना प्रकार', en: 'Scheme Type' },
        search: { hi: 'योजनाएं खोजें', en: 'Find Schemes' },
        benefits: { hi: 'लाभ', en: 'Benefits' },
        eligibility: { hi: 'पात्रता', en: 'Eligibility' },
        documents: { hi: 'जरूरी दस्तावेज', en: 'Required Documents' },
        howToApply: { hi: 'आवेदन प्रक्रिया', en: 'How to Apply' },
        deadline: { hi: 'अंतिम तिथि', en: 'Deadline' },
        helpline: { hi: 'हेल्पलाइन', en: 'Helpline' },
        website: { hi: 'वेबसाइट', en: 'Website' },
        back: { hi: 'वापस', en: 'Back' },
        viewDetails: { hi: 'विवरण देखें', en: 'View Details' }
    };

    const states = [
        'All India', 'Madhya Pradesh', 'Maharashtra', 'Uttar Pradesh', 'Rajasthan', 
        'Punjab', 'Haryana', 'Gujarat', 'Karnataka', 'Andhra Pradesh', 'Bihar', 'Tamil Nadu'
    ];

    const schemeTypes = [
        { hi: 'सभी योजनाएं', en: 'All Schemes', value: '' },
        { hi: 'सब्सिडी', en: 'Subsidies', value: 'subsidy' },
        { hi: 'बीमा', en: 'Insurance', value: 'insurance' },
        { hi: 'लोन/ऋण', en: 'Loans', value: 'loan' },
        { hi: 'उपकरण', en: 'Equipment', value: 'equipment' },
        { hi: 'सिंचाई', en: 'Irrigation', value: 'irrigation' }
    ];

    const getText = (obj) => obj?.[language] || obj?.en || '';

    const fetchSchemes = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await appClient.functions.invoke('getGovtSchemes', {
                state: state === 'All India' ? '' : state,
                scheme_type: schemeType
            });
            setSchemesData(response.data.data);
        } catch (err) {
            setError(language === 'hi' ? 'योजनाएं नहीं मिलीं' : 'Could not fetch schemes');
        } finally {
            setLoading(false);
        }
    };

    const getCategoryColor = (category) => {
        const cat = category?.toLowerCase() || '';
        if (cat.includes('subsidy')) return 'from-emerald-500 to-teal-600';
        if (cat.includes('insurance')) return 'from-sky-500 to-blue-600';
        if (cat.includes('loan') || cat.includes('credit')) return 'from-amber-500 to-orange-600';
        if (cat.includes('equipment')) return 'from-violet-500 to-purple-600';
        return 'from-gray-500 to-gray-600';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <Link to={createPageUrl('Home')}>
                            <Button variant="ghost" className="gap-2 rounded-xl hover:bg-gray-100">
                                <ArrowLeft className="w-4 h-4" />
                                {getText(content.back)}
                            </Button>
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                                <Building className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="text-xl font-bold text-gray-900 hidden sm:block">{getText(content.title)}</h1>
                        </div>
                        <LanguageToggle />
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-8 max-w-5xl">
                {/* Hero */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        {getText(content.title)}
                    </h2>
                    <p className="text-gray-600 text-lg">{getText(content.subtitle)}</p>
                </div>

                {/* Search Card */}
                <Card className="border-0 shadow-xl shadow-gray-200/50 mb-8 overflow-hidden">
                    <CardContent className="p-6">
                        <div className="grid md:grid-cols-3 gap-4">
                            <Select value={state} onValueChange={setState}>
                                <SelectTrigger className="h-14 rounded-xl border-gray-200 bg-gray-50">
                                    <SelectValue placeholder={getText(content.state)} />
                                </SelectTrigger>
                                <SelectContent>
                                    {states.map((s, idx) => (
                                        <SelectItem key={idx} value={s}>{s}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            
                            <Select value={schemeType} onValueChange={setSchemeType}>
                                <SelectTrigger className="h-14 rounded-xl border-gray-200 bg-gray-50">
                                    <SelectValue placeholder={getText(content.type)} />
                                </SelectTrigger>
                                <SelectContent>
                                    {schemeTypes.map((t, idx) => (
                                        <SelectItem key={idx} value={t.value}>{getText(t)}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            
                            <Button 
                                onClick={fetchSchemes} 
                                disabled={loading}
                                className="h-14 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 rounded-xl shadow-lg shadow-violet-500/25"
                            >
                                {loading ? <Loader2 className="animate-spin mr-2" /> : <Search className="w-5 h-5 mr-2" />}
                                {getText(content.search)}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
                {error && <p className="text-red-500 mb-6 text-center bg-red-50 py-3 px-4 rounded-xl">{error}</p>}

                {/* Helpline Banner */}
                {schemesData?.kisan_helpline && (
                    <Card className="scheme-card border-0 shadow-xl mb-6 overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                                        <Phone className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <p className="text-emerald-100 text-sm">{language === 'hi' ? 'किसान हेल्पलाइन' : 'Kisan Helpline'}</p>
                                        <p className="text-2xl font-bold">{schemesData.kisan_helpline}</p>
                                        <p className="text-emerald-100 text-sm">{language === 'hi' ? '24x7 निःशुल्क' : '24x7 Toll Free'}</p>
                                    </div>
                                </div>
                                <a href={`tel:${schemesData.kisan_helpline}`}>
                                    <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50 rounded-xl shadow-lg">
                                        <Phone className="w-5 h-5 mr-2" />
                                        {language === 'hi' ? 'अभी कॉल करें' : 'Call Now'}
                                    </Button>
                                </a>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Important Notice */}
                {schemesData?.important_notice && (
                    <Card className="scheme-card border-0 shadow-xl shadow-amber-200/50 mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-l-amber-500">
                        <CardContent className="p-5">
                            <p className="text-amber-800 flex items-start gap-3">
                                <span className="text-2xl">📢</span>
                                <span className="leading-relaxed">{getText(schemesData.important_notice)}</span>
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Schemes Grid */}
                {schemesData?.schemes && schemesData.schemes.length > 0 && (
                    <div className="space-y-4">
                        {schemesData.schemes.map((scheme, idx) => (
                            <Card 
                                key={idx} 
                                className="scheme-card border-0 shadow-xl shadow-gray-200/50 overflow-hidden hover:shadow-2xl transition-shadow"
                            >
                                <div 
                                    className="cursor-pointer"
                                    onClick={() => setExpandedScheme(expandedScheme === idx ? null : idx)}
                                >
                                    <div className={`h-2 bg-gradient-to-r ${getCategoryColor(scheme.category)}`} />
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-start gap-4 flex-1">
                                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getCategoryColor(scheme.category)} flex items-center justify-center flex-shrink-0`}>
                                                    <Award className="w-7 h-7 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                        {language === 'hi' ? scheme.name_hi : scheme.name_en}
                                                    </h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        <Badge className="rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-100">
                                                            {scheme.category}
                                                        </Badge>
                                                        {scheme.subsidy_amount && (
                                                            <Badge className="rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                                                                <IndianRupee className="w-3 h-3 mr-1" />
                                                                {scheme.subsidy_amount}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <ChevronDown className={`w-6 h-6 text-gray-400 transition-transform ${expandedScheme === idx ? 'rotate-180' : ''}`} />
                                        </div>
                                    </CardContent>
                                </div>

                                {expandedScheme === idx && (
                                    <div className="px-6 pb-6 pt-0 border-t border-gray-100 mt-2">
                                        <div className="pt-6 space-y-6">
                                            {/* Benefits */}
                                            <div className="bg-emerald-50 rounded-2xl p-5">
                                                <h4 className="font-bold text-emerald-800 mb-3 flex items-center gap-2">
                                                    <IndianRupee className="w-5 h-5" />
                                                    {getText(content.benefits)}
                                                </h4>
                                                <p className="text-gray-700 leading-relaxed">
                                                    {language === 'hi' ? scheme.benefits_hi : scheme.benefits_en}
                                                </p>
                                            </div>

                                            {/* Eligibility */}
                                            <div className="bg-sky-50 rounded-2xl p-5">
                                                <h4 className="font-bold text-sky-800 mb-3 flex items-center gap-2">
                                                    <CheckCircle className="w-5 h-5" />
                                                    {getText(content.eligibility)}
                                                </h4>
                                                <ul className="space-y-2">
                                                    {(language === 'hi' ? scheme.eligibility_hi : scheme.eligibility_en)?.map((item, i) => (
                                                        <li key={i} className="flex items-start gap-3 text-gray-700">
                                                            <CheckCircle className="w-5 h-5 text-sky-500 flex-shrink-0 mt-0.5" />
                                                            <span>{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Documents */}
                                            {scheme.documents_required && scheme.documents_required.length > 0 && (
                                                <div className="bg-amber-50 rounded-2xl p-5">
                                                    <h4 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
                                                        <FileText className="w-5 h-5" />
                                                        {getText(content.documents)}
                                                    </h4>
                                                    <div className="grid md:grid-cols-2 gap-2">
                                                        {scheme.documents_required.map((doc, i) => (
                                                            <div key={i} className="flex items-center gap-2 text-gray-700 bg-white rounded-xl p-3">
                                                                <div className="w-2 h-2 bg-amber-500 rounded-full" />
                                                                <span>{doc}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* How to Apply */}
                                            <div className="bg-violet-50 rounded-2xl p-5">
                                                <h4 className="font-bold text-violet-800 mb-3">
                                                    {getText(content.howToApply)}
                                                </h4>
                                                <p className="text-gray-700 leading-relaxed">
                                                    {language === 'hi' ? scheme.how_to_apply_hi : scheme.how_to_apply_en}
                                                </p>
                                            </div>

                                            {/* Quick Links */}
                                            <div className="flex flex-wrap gap-3 pt-2">
                                                {scheme.deadline && (
                                                    <Badge variant="outline" className="px-4 py-2 rounded-xl text-sm">
                                                        <Calendar className="w-4 h-4 mr-2" />
                                                        {getText(content.deadline)}: {scheme.deadline}
                                                    </Badge>
                                                )}
                                                {scheme.website && (
                                                    <a href={scheme.website} target="_blank" rel="noopener noreferrer">
                                                        <Button variant="outline" className="rounded-xl">
                                                            <Globe className="w-4 h-4 mr-2" />
                                                            {getText(content.website)}
                                                            <ExternalLink className="w-3 h-3 ml-2" />
                                                        </Button>
                                                    </a>
                                                )}
                                                {scheme.helpline && (
                                                    <a href={`tel:${scheme.helpline}`}>
                                                        <Button variant="outline" className="rounded-xl">
                                                            <Phone className="w-4 h-4 mr-2" />
                                                            {scheme.helpline}
                                                        </Button>
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default function GovtSchemes() {
    return (
        <LanguageProvider>
            <SchemesContent />
        </LanguageProvider>
    );
}


