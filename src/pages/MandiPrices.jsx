import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Search, Loader2, MapPin, Wheat } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';
import { LanguageProvider, useLanguage } from '../components/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

function MandiContent() {
    const { language } = useLanguage();
    const [crop, setCrop] = useState('');
    const [state, setState] = useState('');
    const [district, setDistrict] = useState('');
    const [priceData, setPriceData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const content = {
        title: { hi: 'मंडी भाव', en: 'Mandi Prices' },
        subtitle: { hi: 'आज के ताजा भाव', en: "Today's Fresh Prices" },
        crop: { hi: 'फसल का नाम', en: 'Crop Name' },
        state: { hi: 'राज्य', en: 'State' },
        district: { hi: 'जिला (वैकल्पिक)', en: 'District (Optional)' },
        search: { hi: 'भाव खोजें', en: 'Search Prices' },
        bestMandi: { hi: 'सबसे अच्छा मंडी', en: 'Best Mandi' },
        marketAdvice: { hi: 'बाजार सलाह', en: 'Market Advice' },
        trend: { hi: 'साप्ताहिक रुझान', en: 'Weekly Trend' },
        min: { hi: 'न्यूनतम', en: 'Min' },
        max: { hi: 'अधिकतम', en: 'Max' },
        modal: { hi: 'औसत', en: 'Modal' },
        back: { hi: '← वापस', en: '← Back' },
        perQuintal: { hi: 'रु/क्विंटल', en: 'Rs/Quintal' }
    };

    const crops = [
        { hi: 'गेहूं', en: 'Wheat' },
        { hi: 'धान', en: 'Rice/Paddy' },
        { hi: 'सोयाबीन', en: 'Soybean' },
        { hi: 'चना', en: 'Gram/Chickpea' },
        { hi: 'मक्का', en: 'Maize' },
        { hi: 'प्याज', en: 'Onion' },
        { hi: 'टमाटर', en: 'Tomato' },
        { hi: 'आलू', en: 'Potato' },
        { hi: 'सरसों', en: 'Mustard' },
        { hi: 'कपास', en: 'Cotton' }
    ];

    const states = [
        'Madhya Pradesh', 'Maharashtra', 'Uttar Pradesh', 'Rajasthan', 
        'Punjab', 'Haryana', 'Gujarat', 'Karnataka', 'Andhra Pradesh', 'Bihar'
    ];

    const getText = (obj) => obj?.[language] || obj?.en || '';

    const getTrendIcon = (trend) => {
        if (trend === 'up') return <TrendingUp className="w-5 h-5 text-green-600" />;
        if (trend === 'down') return <TrendingDown className="w-5 h-5 text-red-600" />;
        return <Minus className="w-5 h-5 text-gray-400" />;
    };

    const fetchPrices = async () => {
        if (!crop.trim()) return;
        setLoading(true);
        setError(null);
        
        try {
            const response = await base44.functions.invoke('getMandiPrices', { crop, state, district });
            setPriceData(response.data.data);
        } catch (err) {
            setError(language === 'hi' ? 'भाव जानकारी नहीं मिली' : 'Could not fetch price data');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-green-50">
            <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link to={createPageUrl('Home')}>
                        <Button variant="ghost" className="text-green-700">
                            {getText(content.back)}
                        </Button>
                    </Link>
                    <h1 className="text-xl font-bold text-amber-800">{getText(content.title)}</h1>
                    <LanguageToggle />
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Search Section */}
                <Card className="mb-8 border-amber-200">
                    <CardContent className="p-6">
                        <div className="grid gap-4 md:grid-cols-4">
                            <div className="md:col-span-2">
                                <label className="text-sm font-medium text-gray-700 mb-1 block">
                                    {getText(content.crop)}
                                </label>
                                <Select value={crop} onValueChange={setCrop}>
                                    <SelectTrigger className="h-12">
                                        <Wheat className="w-4 h-4 mr-2 text-amber-600" />
                                        <SelectValue placeholder={getText(content.crop)} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {crops.map((c, idx) => (
                                            <SelectItem key={idx} value={c.en}>{getText(c)}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">
                                    {getText(content.state)}
                                </label>
                                <Select value={state} onValueChange={setState}>
                                    <SelectTrigger className="h-12">
                                        <MapPin className="w-4 h-4 mr-2 text-amber-600" />
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
                                    {getText(content.district)}
                                </label>
                                <Input
                                    value={district}
                                    onChange={(e) => setDistrict(e.target.value)}
                                    placeholder={getText(content.district)}
                                    className="h-12"
                                />
                            </div>
                        </div>
                        <Button 
                            onClick={fetchPrices} 
                            disabled={loading || !crop}
                            className="mt-4 w-full h-12 bg-amber-600 hover:bg-amber-700"
                        >
                            {loading ? <Loader2 className="animate-spin mr-2" /> : <Search className="w-5 h-5 mr-2" />}
                            {getText(content.search)}
                        </Button>
                        {error && <p className="text-red-500 mt-3 text-center">{error}</p>}
                    </CardContent>
                </Card>

                {priceData && (
                    <>
                        {/* Best Mandi Highlight */}
                        {priceData.best_mandi && (
                            <Card className="mb-6 border-green-300 bg-gradient-to-r from-green-50 to-emerald-50">
                                <CardHeader>
                                    <CardTitle className="text-green-800 flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5" />
                                        {getText(content.bestMandi)}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-2xl font-bold text-green-700">{priceData.best_mandi.name}</p>
                                            <p className="text-sm text-gray-600">
                                                {language === 'hi' ? priceData.best_mandi.reason_hi : priceData.best_mandi.reason_en}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-3xl font-bold text-green-700">₹{priceData.best_mandi.price}</p>
                                            <p className="text-sm text-gray-500">{getText(content.perQuintal)}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Price List */}
                        {priceData.prices && priceData.prices.length > 0 && (
                            <Card className="mb-6 border-amber-200">
                                <CardHeader>
                                    <CardTitle className="text-amber-800">
                                        {language === 'hi' ? priceData.crop_name_hi : priceData.crop_name} - {priceData.price_date}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-amber-50">
                                                <tr>
                                                    <th className="text-left p-3 text-sm font-medium">Mandi</th>
                                                    <th className="text-right p-3 text-sm font-medium">{getText(content.min)}</th>
                                                    <th className="text-right p-3 text-sm font-medium">{getText(content.max)}</th>
                                                    <th className="text-right p-3 text-sm font-medium">{getText(content.modal)}</th>
                                                    <th className="text-center p-3 text-sm font-medium">{getText(content.trend)}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {priceData.prices.map((price, idx) => (
                                                    <tr key={idx} className="border-b hover:bg-amber-25">
                                                        <td className="p-3">
                                                            <p className="font-medium">{price.mandi}</p>
                                                            <p className="text-xs text-gray-500">{price.district}, {price.state}</p>
                                                        </td>
                                                        <td className="text-right p-3">₹{price.min_price}</td>
                                                        <td className="text-right p-3">₹{price.max_price}</td>
                                                        <td className="text-right p-3 font-bold text-amber-700">₹{price.modal_price}</td>
                                                        <td className="text-center p-3">{getTrendIcon(price.trend)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Market Advice & Trend */}
                        <div className="grid md:grid-cols-2 gap-4">
                            {priceData.market_advice && (
                                <Card className="border-green-200">
                                    <CardHeader>
                                        <CardTitle className="text-sm text-green-700">{getText(content.marketAdvice)}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-700">{getText(priceData.market_advice)}</p>
                                    </CardContent>
                                </Card>
                            )}
                            {priceData.weekly_trend && (
                                <Card className="border-blue-200">
                                    <CardHeader>
                                        <CardTitle className="text-sm text-blue-700 flex items-center gap-2">
                                            {getTrendIcon(priceData.weekly_trend.direction)}
                                            {getText(content.trend)} ({priceData.weekly_trend.percentage}%)
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-700">
                                            {language === 'hi' ? priceData.weekly_trend.analysis_hi : priceData.weekly_trend.analysis_en}
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

export default function MandiPrices() {
    return (
        <LanguageProvider>
            <MandiContent />
        </LanguageProvider>
    );
}