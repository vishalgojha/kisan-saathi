import { useMemo, useState } from 'react';
import { BadgeCheck, Filter, Landmark, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useLanguage } from './LanguageContext';

type GovtSchemesProps = {
    defaultState?: string;
    crops?: string[];
};

type SchemeCategory = 'income_support' | 'insurance' | 'credit' | 'equipment' | 'irrigation';

type Scheme = {
    id: string;
    name: { en: string; hi: string };
    category: SchemeCategory;
    states: string[];
    crops: string[];
    benefits: { en: string; hi: string };
    eligibility: { en: string[]; hi: string[] };
    amount: string;
    website: string;
};

const schemes: Scheme[] = [
    {
        id: 'pm-kisan',
        name: { en: 'PM-KISAN Income Support', hi: 'पीएम-किसान आय सहायता' },
        category: 'income_support',
        states: ['All India'],
        crops: ['All Crops'],
        benefits: {
            en: 'Direct income support paid in installments to eligible farmer families.',
            hi: 'पात्र किसान परिवारों को किस्तों में प्रत्यक्ष आय सहायता।'
        },
        eligibility: {
            en: ['Small/marginal farmer families', 'Valid Aadhaar and bank account linkage'],
            hi: ['लघु/सीमांत किसान परिवार', 'आधार और बैंक खाते का सही लिंक']
        },
        amount: 'Rs 6,000/year',
        website: 'https://pmkisan.gov.in'
    },
    {
        id: 'pmfby',
        name: { en: 'PMFBY Crop Insurance', hi: 'प्रधानमंत्री फसल बीमा योजना' },
        category: 'insurance',
        states: ['All India'],
        crops: ['Wheat', 'Rice', 'Cotton', 'Soybean', 'Maize'],
        benefits: {
            en: 'Insurance coverage for crop loss due to drought, flood, storms, and pests.',
            hi: 'सूखा, बाढ़, तूफान और कीट से फसल हानि पर बीमा सुरक्षा।'
        },
        eligibility: {
            en: ['Farmers growing notified crops in notified areas', 'Enrollment within season window'],
            hi: ['अधिसूचित क्षेत्र में अधिसूचित फसल उगाने वाले किसान', 'सीजन समय-सीमा में पंजीकरण']
        },
        amount: 'Premium subsidized',
        website: 'https://pmfby.gov.in'
    },
    {
        id: 'kcc',
        name: { en: 'Kisan Credit Card (KCC)', hi: 'किसान क्रेडिट कार्ड (KCC)' },
        category: 'credit',
        states: ['All India'],
        crops: ['All Crops'],
        benefits: {
            en: 'Short-term working capital support for seeds, fertilizers, and farm expenses.',
            hi: 'बीज, उर्वरक और खेती खर्च के लिए अल्पकालिक ऋण सुविधा।'
        },
        eligibility: {
            en: ['Individual/joint farmers', 'Land records and KYC compliance'],
            hi: ['व्यक्तिगत/संयुक्त किसान', 'भूमि रिकॉर्ड और KYC अनुपालन']
        },
        amount: 'As per bank eligibility',
        website: 'https://www.pmkisan.gov.in'
    },
    {
        id: 'pm-kusum',
        name: { en: 'PM-KUSUM (Solar Pump Support)', hi: 'पीएम-कुसुम (सोलर पंप सहायता)' },
        category: 'equipment',
        states: ['Madhya Pradesh', 'Rajasthan', 'Maharashtra', 'Gujarat', 'All India'],
        crops: ['All Crops'],
        benefits: {
            en: 'Subsidy support for solar pumps and decentralized clean energy for farms.',
            hi: 'सोलर पंप और विकेंद्रीकृत स्वच्छ ऊर्जा के लिए सब्सिडी सहायता।'
        },
        eligibility: {
            en: ['Farmers with irrigation requirement', 'State nodal agency approval'],
            hi: ['सिंचाई जरूरत वाले किसान', 'राज्य नोडल एजेंसी की स्वीकृति']
        },
        amount: 'Up to ~60% support (state-dependent)',
        website: 'https://mnre.gov.in'
    },
    {
        id: 'micro-irrigation',
        name: { en: 'Per Drop More Crop (Micro Irrigation)', hi: 'पर ड्रॉप मोर क्रॉप (माइक्रो सिंचाई)' },
        category: 'irrigation',
        states: ['Madhya Pradesh', 'Maharashtra', 'Karnataka', 'Andhra Pradesh', 'All India'],
        crops: ['Wheat', 'Rice', 'Vegetables', 'Fruits', 'Cotton'],
        benefits: {
            en: 'Subsidy for drip and sprinkler systems to save water and improve yield.',
            hi: 'ड्रिप/स्प्रिंकलर सिस्टम पर सब्सिडी, पानी बचत और उत्पादन वृद्धि के लिए।'
        },
        eligibility: {
            en: ['Landholding farmers', 'Plot suitability for micro-irrigation'],
            hi: ['भूमिधर किसान', 'माइक्रो सिंचाई के लिए खेत की उपयुक्तता']
        },
        amount: 'State-wise subsidy slabs',
        website: 'https://pmksy.gov.in'
    }
];

const categoryOptions: { value: SchemeCategory | 'all'; en: string; hi: string }[] = [
    { value: 'all', en: 'All Categories', hi: 'सभी श्रेणियां' },
    { value: 'income_support', en: 'Income Support', hi: 'आय सहायता' },
    { value: 'insurance', en: 'Insurance', hi: 'बीमा' },
    { value: 'credit', en: 'Credit', hi: 'ऋण/क्रेडिट' },
    { value: 'equipment', en: 'Equipment', hi: 'उपकरण' },
    { value: 'irrigation', en: 'Irrigation', hi: 'सिंचाई' }
];

export default function GovtSchemes({ defaultState = 'All India', crops = [] }: GovtSchemesProps) {
    const { language } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedState, setSelectedState] = useState(defaultState || 'All India');
    const [selectedCrop, setSelectedCrop] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState<SchemeCategory | 'all'>('all');

    const stateOptions = useMemo(() => {
        const uniqueStates = new Set<string>(['All India']);
        schemes.forEach((scheme) => {
            scheme.states.forEach((state) => uniqueStates.add(state));
        });
        if (defaultState) uniqueStates.add(defaultState);
        return Array.from(uniqueStates);
    }, [defaultState]);

    const cropOptions = useMemo(() => {
        const uniqueCrops = new Set<string>(['all']);
        crops.forEach((crop) => uniqueCrops.add(crop));
        schemes.forEach((scheme) => {
            scheme.crops.forEach((crop) => uniqueCrops.add(crop));
        });
        return Array.from(uniqueCrops);
    }, [crops]);

    const filteredSchemes = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();
        return schemes.filter((scheme) => {
            const matchesState = selectedState === 'All India' || scheme.states.includes('All India') || scheme.states.includes(selectedState);
            const matchesCrop = selectedCrop === 'all' || scheme.crops.includes('All Crops') || scheme.crops.includes(selectedCrop);
            const matchesCategory = selectedCategory === 'all' || scheme.category === selectedCategory;

            const textBlob = `${scheme.name.en} ${scheme.name.hi} ${scheme.benefits.en} ${scheme.benefits.hi}`.toLowerCase();
            const matchesSearch = query.length === 0 || textBlob.includes(query);

            return matchesState && matchesCrop && matchesCategory && matchesSearch;
        });
    }, [searchTerm, selectedState, selectedCrop, selectedCategory]);

    const content = {
        title: { hi: 'सरकारी योजना खोजक', en: 'Government Schemes Finder' },
        subtitle: { hi: 'राज्य, फसल और श्रेणी के अनुसार योजनाएं खोजें', en: 'Find schemes by state, crop, and category' },
        search: { hi: 'योजना खोजें...', en: 'Search schemes...' },
        state: { hi: 'राज्य', en: 'State' },
        crop: { hi: 'फसल', en: 'Crop' },
        category: { hi: 'श्रेणी', en: 'Category' },
        eligibility: { hi: 'पात्रता', en: 'Eligibility' },
        benefits: { hi: 'लाभ', en: 'Benefits' },
        amount: { hi: 'सहायता', en: 'Support' },
        visit: { hi: 'वेबसाइट देखें', en: 'Visit Website' },
        results: { hi: 'परिणाम', en: 'Results' },
        noResult: { hi: 'कोई योजना नहीं मिली', en: 'No schemes found' },
        note: {
            hi: 'आवेदन से पहले अंतिम तिथि और दस्तावेज आधिकारिक वेबसाइट पर जांचें।',
            en: 'Before applying, verify deadlines and documents on official portals.'
        },
        allCrops: { hi: 'सभी फसलें', en: 'All Crops' }
    };

    const getText = (obj: { hi: string; en: string }) => obj[language] || obj.en;

    return (
        <Card className="border-0 shadow-lg">
            <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <Landmark className="w-5 h-5 text-violet-600" />
                            {getText(content.title)}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">{getText(content.subtitle)}</p>
                    </div>
                    <Badge className="bg-violet-50 text-violet-700 border border-violet-200">
                        <Filter className="w-3 h-3 mr-1" />
                        {getText(content.results)}: {filteredSchemes.length}
                    </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                    <div className="lg:col-span-2">
                        <p className="text-xs font-semibold text-gray-600 mb-2">{getText(content.search)}</p>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                                placeholder={getText(content.search)}
                                className="pl-9 h-10 rounded-xl bg-gray-50 border-gray-200"
                            />
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-600 mb-2">{getText(content.state)}</p>
                        <Select value={selectedState} onValueChange={setSelectedState}>
                            <SelectTrigger className="h-10 rounded-xl bg-gray-50 border-gray-200">
                                <SelectValue placeholder={getText(content.state)} />
                            </SelectTrigger>
                            <SelectContent>
                                {stateOptions.map((state) => (
                                    <SelectItem key={state} value={state}>
                                        {state}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-600 mb-2">{getText(content.crop)}</p>
                        <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                            <SelectTrigger className="h-10 rounded-xl bg-gray-50 border-gray-200">
                                <SelectValue placeholder={getText(content.crop)} />
                            </SelectTrigger>
                            <SelectContent>
                                {cropOptions.map((cropOption) => (
                                    <SelectItem key={cropOption} value={cropOption}>
                                        {cropOption === 'all' ? getText(content.allCrops) : cropOption}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="md:col-span-2 lg:col-span-4">
                        <p className="text-xs font-semibold text-gray-600 mb-2">{getText(content.category)}</p>
                        <Select value={selectedCategory} onValueChange={(value: SchemeCategory | 'all') => setSelectedCategory(value)}>
                            <SelectTrigger className="h-10 rounded-xl bg-gray-50 border-gray-200">
                                <SelectValue placeholder={getText(content.category)} />
                            </SelectTrigger>
                            <SelectContent>
                                {categoryOptions.map((category) => (
                                    <SelectItem key={category.value} value={category.value}>
                                        {language === 'hi' ? category.hi : category.en}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-3">
                    {filteredSchemes.map((scheme) => (
                        <div key={scheme.id} className="rounded-xl border border-gray-100 bg-white p-4">
                            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                                <div>
                                    <h4 className="font-semibold text-gray-900">
                                        {language === 'hi' ? scheme.name.hi : scheme.name.en}
                                    </h4>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {getText(content.amount)}: {scheme.amount}
                                    </p>
                                </div>
                                <Badge className="bg-gray-100 text-gray-700 border border-gray-200">
                                    {language === 'hi'
                                        ? categoryOptions.find((item) => item.value === scheme.category)?.hi
                                        : categoryOptions.find((item) => item.value === scheme.category)?.en}
                                </Badge>
                            </div>

                            <p className="text-sm text-gray-700 mb-3">
                                <span className="font-semibold">{getText(content.benefits)}: </span>
                                {language === 'hi' ? scheme.benefits.hi : scheme.benefits.en}
                            </p>

                            <div className="rounded-lg bg-violet-50/50 border border-violet-100 p-3">
                                <p className="text-xs font-semibold text-violet-700 mb-1 flex items-center gap-1">
                                    <BadgeCheck className="w-3.5 h-3.5" />
                                    {getText(content.eligibility)}
                                </p>
                                <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
                                    {(language === 'hi' ? scheme.eligibility.hi : scheme.eligibility.en).map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-3">
                                <a href={scheme.website} target="_blank" rel="noopener noreferrer">
                                    <Button variant="outline" size="sm" className="rounded-lg">
                                        {getText(content.visit)}
                                    </Button>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredSchemes.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">{getText(content.noResult)}</p>
                )}

                <p className="text-xs text-gray-500 mt-4">{getText(content.note)}</p>
            </CardContent>
        </Card>
    );
}
