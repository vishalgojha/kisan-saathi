import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, MapPin, Minus, RefreshCw, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from './LanguageContext';

type MarketPricesProps = {
    crops?: string[];
    defaultState?: string;
};

type Trend = 'up' | 'down' | 'stable';

type PriceRow = {
    mandi: string;
    district: string;
    minPrice: number;
    maxPrice: number;
    modalPrice: number;
    trend: Trend;
};

const stateDistricts: Record<string, string[]> = {
    'Madhya Pradesh': ['Indore', 'Bhopal', 'Ujjain', 'Dewas'],
    Maharashtra: ['Nashik', 'Pune', 'Nagpur', 'Jalgaon'],
    'Uttar Pradesh': ['Kanpur', 'Lucknow', 'Varanasi', 'Agra'],
    Rajasthan: ['Jaipur', 'Kota', 'Ajmer', 'Alwar'],
    Punjab: ['Ludhiana', 'Patiala', 'Amritsar', 'Bathinda'],
    Haryana: ['Karnal', 'Hisar', 'Rohtak', 'Sirsa'],
    Gujarat: ['Ahmedabad', 'Rajkot', 'Surat', 'Vadodara']
};

const basePriceMap: Record<string, number> = {
    wheat: 2400,
    rice: 2650,
    soybean: 5200,
    gram: 5400,
    maize: 2150,
    mustard: 6100,
    cotton: 7400,
    onion: 1700,
    tomato: 1600,
    potato: 1500
};

const hashText = (value: string) =>
    value.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

const formatINR = (value: number) =>
    new Intl.NumberFormat('en-IN').format(Math.round(value));

const buildMockPrices = (crop: string, state: string, refreshKey: number): PriceRow[] => {
    const districts = stateDistricts[state] || ['Local District'];
    const normalizedCrop = crop.trim().toLowerCase();
    const base = basePriceMap[normalizedCrop] || 2500;
    const seed = hashText(`${normalizedCrop}:${state}:${refreshKey}`);

    const rows = districts.map((district, index) => {
        const variation = ((seed + index * 43) % 451) - 220;
        const modalPrice = Math.max(500, base + variation);
        const minPrice = Math.max(300, modalPrice - (120 + (index % 3) * 15));
        const maxPrice = modalPrice + (100 + (index % 4) * 25);
        const trendScore = (seed + index) % 3;
        const trend: Trend = trendScore === 0 ? 'up' : trendScore === 1 ? 'down' : 'stable';

        return {
            mandi: `${district} APMC`,
            district,
            minPrice,
            maxPrice,
            modalPrice,
            trend
        };
    });

    return rows.sort((a, b) => b.modalPrice - a.modalPrice);
};

export default function MarketPrices({ crops = [], defaultState = 'Madhya Pradesh' }: MarketPricesProps) {
    const { language } = useLanguage();
    const [refreshKey, setRefreshKey] = useState(0);

    const cropOptions = useMemo(() => {
        if (crops.length > 0) return crops;
        return ['Wheat', 'Rice', 'Soybean', 'Maize'];
    }, [crops]);

    const [selectedCrop, setSelectedCrop] = useState(cropOptions[0] || 'Wheat');
    const [selectedState, setSelectedState] = useState(defaultState);

    useEffect(() => {
        if (!cropOptions.includes(selectedCrop)) {
            setSelectedCrop(cropOptions[0] || 'Wheat');
        }
    }, [cropOptions, selectedCrop]);

    const prices = useMemo(
        () => buildMockPrices(selectedCrop, selectedState, refreshKey),
        [selectedCrop, selectedState, refreshKey]
    );

    const bestMarket = prices[0];

    const content = {
        title: { hi: 'मार्केट प्राइस कार्ड', en: 'Market Prices Card' },
        subtitle: { hi: 'फसल और राज्य चुनें, ताजा अनुमानित मंडी भाव देखें', en: 'Select crop and state to view mock mandi prices' },
        crop: { hi: 'फसल', en: 'Crop' },
        state: { hi: 'राज्य', en: 'State' },
        refresh: { hi: 'रिफ्रेश', en: 'Refresh' },
        bestMandi: { hi: 'सर्वश्रेष्ठ मंडी', en: 'Best Mandi' },
        modal: { hi: 'मॉडल भाव', en: 'Modal Price' },
        min: { hi: 'न्यूनतम', en: 'Min' },
        max: { hi: 'अधिकतम', en: 'Max' },
        trend: { hi: 'रुझान', en: 'Trend' },
        perQuintal: { hi: 'रु/क्विंटल', en: 'Rs/Quintal' },
        updated: { hi: 'अपडेटेड', en: 'Updated' },
        market: { hi: 'मंडी', en: 'Mandi' },
        district: { hi: 'जिला', en: 'District' },
        note: {
            hi: 'डेमो डेटा: वास्तविक बिक्री से पहले स्थानीय मंडी रेट जांचें।',
            en: 'Demo data: verify with local mandi rates before sale.'
        }
    };

    const getText = (obj: { hi: string; en: string }) => obj[language] || obj.en;

    const getTrendIcon = (trend: Trend) => {
        if (trend === 'up') return <ArrowUp className="w-3.5 h-3.5 text-emerald-600" />;
        if (trend === 'down') return <ArrowDown className="w-3.5 h-3.5 text-red-600" />;
        return <Minus className="w-3.5 h-3.5 text-gray-500" />;
    };

    const getTrendText = (trend: Trend) => {
        if (trend === 'up') return language === 'hi' ? 'ऊपर' : 'Up';
        if (trend === 'down') return language === 'hi' ? 'नीचे' : 'Down';
        return language === 'hi' ? 'स्थिर' : 'Stable';
    };

    return (
        <Card className="border-0 shadow-lg">
            <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-amber-600" />
                            {getText(content.title)}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">{getText(content.subtitle)}</p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setRefreshKey((prev) => prev + 1)}
                        className="rounded-xl"
                    >
                        <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                        {getText(content.refresh)}
                    </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-3 mb-4">
                    <div>
                        <p className="text-xs font-semibold text-gray-600 mb-2">{getText(content.crop)}</p>
                        <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                            <SelectTrigger className="h-10 rounded-xl bg-gray-50 border-gray-200">
                                <SelectValue placeholder={getText(content.crop)} />
                            </SelectTrigger>
                            <SelectContent>
                                {cropOptions.map((crop) => (
                                    <SelectItem key={crop} value={crop}>
                                        {crop}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-600 mb-2">{getText(content.state)}</p>
                        <Select value={selectedState} onValueChange={setSelectedState}>
                            <SelectTrigger className="h-10 rounded-xl bg-gray-50 border-gray-200">
                                <SelectValue placeholder={getText(content.state)} />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.keys(stateDistricts).map((state) => (
                                    <SelectItem key={state} value={state}>
                                        {state}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {bestMarket && (
                    <div className="rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 p-4 mb-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <p className="text-xs text-amber-700 font-semibold">{getText(content.bestMandi)}</p>
                                <p className="font-semibold text-gray-900 flex items-center gap-1.5 mt-1">
                                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                                    {bestMarket.mandi}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {getText(content.updated)}: {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                            <Badge className="bg-white text-amber-700 border border-amber-200 text-sm px-3 py-1">
                                {getText(content.modal)}: Rs {formatINR(bestMarket.modalPrice)}
                            </Badge>
                        </div>
                    </div>
                )}

                <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-100">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr className="text-left text-gray-600">
                                <th className="px-3 py-2 font-medium">{getText(content.market)}</th>
                                <th className="px-3 py-2 font-medium">{getText(content.district)}</th>
                                <th className="px-3 py-2 font-medium">{getText(content.min)}</th>
                                <th className="px-3 py-2 font-medium">{getText(content.modal)}</th>
                                <th className="px-3 py-2 font-medium">{getText(content.max)}</th>
                                <th className="px-3 py-2 font-medium">{getText(content.trend)}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {prices.map((row) => (
                                <tr key={row.mandi} className="border-t border-gray-100">
                                    <td className="px-3 py-2 text-gray-800 font-medium">{row.mandi}</td>
                                    <td className="px-3 py-2 text-gray-600">{row.district}</td>
                                    <td className="px-3 py-2">Rs {formatINR(row.minPrice)}</td>
                                    <td className="px-3 py-2 font-semibold text-amber-700">Rs {formatINR(row.modalPrice)}</td>
                                    <td className="px-3 py-2">Rs {formatINR(row.maxPrice)}</td>
                                    <td className="px-3 py-2">
                                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs">
                                            {getTrendIcon(row.trend)}
                                            {getTrendText(row.trend)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="md:hidden space-y-2">
                    {prices.map((row) => (
                        <div key={row.mandi} className="rounded-xl border border-gray-100 bg-white p-3">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="font-semibold text-gray-900">{row.mandi}</p>
                                    <p className="text-xs text-gray-500">{row.district}</p>
                                </div>
                                <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs">
                                    {getTrendIcon(row.trend)}
                                    {getTrendText(row.trend)}
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                                <div>
                                    <p className="text-gray-500">{getText(content.min)}</p>
                                    <p className="font-medium">Rs {formatINR(row.minPrice)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">{getText(content.modal)}</p>
                                    <p className="font-semibold text-amber-700">Rs {formatINR(row.modalPrice)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">{getText(content.max)}</p>
                                    <p className="font-medium">Rs {formatINR(row.maxPrice)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <p className="text-xs text-gray-500 mt-3">
                    {getText(content.perQuintal)} • {getText(content.note)}
                </p>
            </CardContent>
        </Card>
    );
}
