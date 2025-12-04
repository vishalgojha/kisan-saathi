import React, { useState } from 'react';
import { FileText, Phone, Globe, Search, Loader2, IndianRupee, Calendar, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { base44 } from '@/api/base44Client';
import { LanguageProvider, useLanguage } from '../components/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

function SchemesContent() {
    const { language } = useLanguage();
    const [state, setState] = useState('');
    const [schemeType, setSchemeType] = useState('');
    const [schemesData, setSchemesData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const content = {
        title: { hi: 'सरकारी योजनाएं', en: 'Government Schemes' },
        subtitle: { hi: 'किसानों के लिए योजनाएं और सब्सिडी', en: 'Schemes & Subsidies for Farmers' },
        state: { hi: 'राज्य चुनें', en: 'Select State' },
        type: { hi: 'योजना प्रकार', en: 'Scheme Type' },
        search: { hi: 'योजनाएं खोजें', en: 'Search Schemes' },
        benefits: { hi: 'लाभ', en: 'Benefits' },
        eligibility: { hi: 'पात्रता', en: 'Eligibility' },
        documents: { hi: 'जरूरी दस्तावेज', en: 'Required Documents' },
        howToApply: { hi: 'कैसे आवेदन करें', en: 'How to Apply' },
        deadline: { hi: 'अंतिम तिथि', en: 'Deadline' },
        helpline: { hi: 'हेल्पलाइन', en: 'Helpline' },
        website: { hi: 'वेबसाइट', en: 'Website' },
        back: { hi: '← वापस', en: '← Back' }
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
            const response = await base44.functions.invoke('getGovtSchemes', {
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

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-green-50">
            <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link to={createPageUrl('Home')}>
                        <Button variant="ghost" className="text-green-700">
                            {getText(content.back)}
                        </Button>
                    </Link>
                    <h1 className="text-xl font-bold text-orange-800">{getText(content.title)}</h1>
                    <LanguageToggle />
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Search Section */}
                <Card className="mb-8 border-orange-200">
                    <CardContent className="p-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">
                                    {getText(content.state)}
                                </label>
                                <Select value={state} onValueChange={setState}>
                                    <SelectTrigger className="h-12">
                                        <SelectValue placeholder={getText(content.state)} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {states.map((s, idx) => (
                                            <SelectItem key={idx} value={s}>{s}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">
                                    {getText(content.type)}
                                </label>
                                <Select value={schemeType} onValueChange={setSchemeType}>
                                    <SelectTrigger className="h-12">
                                        <SelectValue placeholder={getText(content.type)} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {schemeTypes.map((t, idx) => (
                                            <SelectItem key={idx} value={t.value}>{getText(t)}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <Button 
                            onClick={fetchSchemes} 
                            disabled={loading}
                            className="mt-4 w-full h-12 bg-orange-600 hover:bg-orange-700"
                        >
                            {loading ? <Loader2 className="animate-spin mr-2" /> : <Search className="w-5 h-5 mr-2" />}
                            {getText(content.search)}
                        </Button>
                        {error && <p className="text-red-500 mt-3 text-center">{error}</p>}
                    </CardContent>
                </Card>

                {/* Helpline Banner */}
                {schemesData?.kisan_helpline && (
                    <Card className="mb-6 bg-gradient-to-r from-green-600 to-green-700 text-white">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Phone className="w-8 h-8" />
                                <div>
                                    <p className="font-bold">{language === 'hi' ? 'किसान हेल्पलाइन' : 'Kisan Helpline'}</p>
                                    <p className="text-green-100 text-sm">{language === 'hi' ? '24x7 उपलब्ध' : 'Available 24x7'}</p>
                                </div>
                            </div>
                            <a href={`tel:${schemesData.kisan_helpline}`}>
                                <Button variant="secondary" size="lg">
                                    {schemesData.kisan_helpline}
                                </Button>
                            </a>
                        </CardContent>
                    </Card>
                )}

                {/* Important Notice */}
                {schemesData?.important_notice && (
                    <Card className="mb-6 border-amber-300 bg-amber-50">
                        <CardContent className="p-4">
                            <p className="text-amber-800">
                                <strong>📢 </strong>
                                {getText(schemesData.important_notice)}
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Schemes List */}
                {schemesData?.schemes && schemesData.schemes.length > 0 && (
                    <Accordion type="single" collapsible className="space-y-4">
                        {schemesData.schemes.map((scheme, idx) => (
                            <AccordionItem key={idx} value={`scheme-${idx}`} className="border rounded-xl overflow-hidden">
                                <AccordionTrigger className="px-6 py-4 bg-gradient-to-r from-orange-50 to-amber-50 hover:no-underline">
                                    <div className="flex items-start gap-4 text-left">
                                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <FileText className="w-6 h-6 text-orange-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">
                                                {language === 'hi' ? scheme.name_hi : scheme.name_en}
                                            </h3>
                                            <div className="flex gap-2 mt-1">
                                                <Badge variant="outline">{scheme.category}</Badge>
                                                {scheme.subsidy_amount && (
                                                    <Badge className="bg-green-100 text-green-800">
                                                        <IndianRupee className="w-3 h-3 mr-1" />
                                                        {scheme.subsidy_amount}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-6 py-4 bg-white">
                                    {/* Benefits */}
                                    <div className="mb-4">
                                        <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                                            <IndianRupee className="w-4 h-4" />
                                            {getText(content.benefits)}
                                        </h4>
                                        <p className="text-gray-700 bg-green-50 p-3 rounded-lg">
                                            {language === 'hi' ? scheme.benefits_hi : scheme.benefits_en}
                                        </p>
                                    </div>

                                    {/* Eligibility */}
                                    <div className="mb-4">
                                        <h4 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4" />
                                            {getText(content.eligibility)}
                                        </h4>
                                        <ul className="space-y-1 bg-blue-50 p-3 rounded-lg">
                                            {(language === 'hi' ? scheme.eligibility_hi : scheme.eligibility_en)?.map((item, i) => (
                                                <li key={i} className="flex items-start gap-2">
                                                    <span className="text-blue-600">✓</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Documents */}
                                    {scheme.documents_required && scheme.documents_required.length > 0 && (
                                        <div className="mb-4">
                                            <h4 className="font-semibold text-amber-700 mb-2 flex items-center gap-2">
                                                <FileText className="w-4 h-4" />
                                                {getText(content.documents)}
                                            </h4>
                                            <ul className="space-y-1 bg-amber-50 p-3 rounded-lg">
                                                {scheme.documents_required.map((doc, i) => (
                                                    <li key={i} className="flex items-start gap-2">
                                                        <span className="text-amber-600">•</span>
                                                        <span>{doc}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* How to Apply */}
                                    <div className="mb-4">
                                        <h4 className="font-semibold text-purple-700 mb-2">
                                            {getText(content.howToApply)}
                                        </h4>
                                        <p className="text-gray-700 bg-purple-50 p-3 rounded-lg">
                                            {language === 'hi' ? scheme.how_to_apply_hi : scheme.how_to_apply_en}
                                        </p>
                                    </div>

                                    {/* Quick Links */}
                                    <div className="flex flex-wrap gap-3 pt-4 border-t">
                                        {scheme.deadline && (
                                            <Badge variant="outline" className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {getText(content.deadline)}: {scheme.deadline}
                                            </Badge>
                                        )}
                                        {scheme.website && (
                                            <a href={scheme.website} target="_blank" rel="noopener noreferrer">
                                                <Button variant="outline" size="sm">
                                                    <Globe className="w-4 h-4 mr-1" />
                                                    {getText(content.website)}
                                                </Button>
                                            </a>
                                        )}
                                        {scheme.helpline && (
                                            <a href={`tel:${scheme.helpline}`}>
                                                <Button variant="outline" size="sm">
                                                    <Phone className="w-4 h-4 mr-1" />
                                                    {scheme.helpline}
                                                </Button>
                                            </a>
                                        )}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
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