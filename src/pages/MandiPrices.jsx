import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, Search, Loader2, MapPin, Wheat, ArrowLeft, IndianRupee, BarChart3, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';
import { LanguageProvider, useLanguage } from '../components/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import gsap from 'gsap';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function MandiContent() {
    const { language } = useLanguage();
    const [crop, setCrop] = useState('');
    const [state, setState] = useState('');
    const [district, setDistrict] = useState('');
    const [priceData, setPriceData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (priceData) {
            gsap.from('.price-card', {
                y: 30,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power3.out'
            });
        }
    }, [priceData]);

    const content = {
        title: { hi: 'लाइव मंडी भाव', en: 'Live Mandi Prices' },
        subtitle: { hi: 'रियल-टाइम मार्केट रेट और विश्लेषण', en: 'Real-time market rates & analysis' },
        crop: { hi: 'फसल चुनें', en: 'Select Crop' },
        state: { hi: 'राज्य', en: 'State' },
        district: { hi: 'जिला (वैकल्पिक)', en: 'District (Optional)' },
        search: { hi: 'भाव खोजें', en: 'Get Prices' },
        bestMandi: { hi: 'सर्वश्रेष्ठ मंडी', en: 'Best Mandi' },
        marketAdvice: { hi: 'बाजार सलाह', en: 'Market Advice' },
        trend: { hi: 'साप्ताहिक ट्रेंड', en: 'Weekly Trend' },
        priceComparison: { hi: 'मूल्य तुलना', en: 'Price Comparison' },
        back: { hi: 'वापस', en: 'Back' },
        perQuintal: { hi: 'रु/क्विंटल', en: 'Rs/Quintal' }
    };

    const crops = [
        { hi: 'गेहूं', en: 'Wheat' },
        { hi: 'धान', en: 'Rice' },
        { hi: 'सोयाबीन', en: 'Soybean' },
        { hi: 'चना', en: 'Gram' },
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
        if (trend === 'up') return <TrendingUp className="w-5 h-5 text-emerald-600" />;
        if (trend === 'down') return <TrendingDown className="w-5 h-5 text-red-500" />;
        return <Minus className="w-5 h-5 text-gray-400" />;
    };

    const getTrendBg = (trend) => {
        if (trend === 'up') return 'bg-emerald-50 text-emerald-700';
        if (trend === 'down') return 'bg-red-50 text-red-700';
        return 'bg-gray-50 text-gray-700';
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

    const chartData = priceData?.prices ? {
        labels: priceData.prices.slice(0, 6).map(p => p.mandi),
        datasets: [{
            label: getText(content.perQuintal),
            data: priceData.prices.slice(0, 6).map(p => p.modal_price),
            backgroundColor: 'rgba(245, 158, 11, 0.8)',
            borderColor: 'rgb(245, 158, 11)',
            borderWidth: 2,
            borderRadius: 8
        }]
    } : null;

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'white',
                titleColor: '#1f2937',
                bodyColor: '#1f2937',
                borderColor: '#e5e7eb',
                borderWidth: 1,
                padding: 12,
                displayColors: false
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                grid: { color: '#f3f4f6' },
                ticks: { callback: (value) => `₹${value}` }
            },
            x: {
                grid: { display: false }
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
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
                            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="text-xl font-bold text-gray-900 hidden sm:block">{getText(content.title)}</h1>
                        </div>
                        <LanguageToggle />
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-8 max-w-6xl">
                {/* Hero Search */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        {getText(content.title)}
                    </h2>
                    <p className="text-gray-600 text-lg mb-8">{getText(content.subtitle)}</p>
                    
                    <Card className="max-w-3xl mx-auto border-0 shadow-xl shadow-gray-200/50 overflow-hidden">
                        <CardContent className="p-6">
                            <div className="grid md:grid-cols-4 gap-4">
                                <Select value={crop} onValueChange={setCrop}>
                                    <SelectTrigger className="h-14 rounded-xl border-gray-200 bg-gray-50">
                                        <Wheat className="w-4 h-4 mr-2 text-amber-600" />
                                        <SelectValue placeholder={getText(content.crop)} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {crops.map((c, idx) => (
                                            <SelectItem key={idx} value={c.en}>{getText(c)}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                
                                <Select value={state} onValueChange={setState}>
                                    <SelectTrigger className="h-14 rounded-xl border-gray-200 bg-gray-50">
                                        <MapPin className="w-4 h-4 mr-2 text-amber-600" />
                                        <SelectValue placeholder={getText(content.state)} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {states.map((s, idx) => (
                                            <SelectItem key={idx} value={s}>{s}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                
                                <Input
                                    value={district}
                                    onChange={(e) => setDistrict(e.target.value)}
                                    placeholder={getText(content.district)}
                                    className="h-14 rounded-xl border-gray-200 bg-gray-50"
                                />
                                
                                <Button 
                                    onClick={fetchPrices} 
                                    disabled={loading || !crop}
                                    className="h-14 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-xl shadow-lg shadow-amber-500/25"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : <Search className="w-5 h-5 mr-2" />}
                                    {getText(content.search)}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                    {error && <p className="text-red-500 mt-4 bg-red-50 py-2 px-4 rounded-lg inline-block">{error}</p>}
                </div>

                {priceData && (
                    <div className="space-y-6">
                        {/* Best Mandi Highlight */}
                        {priceData.best_mandi && (
                            <Card className="price-card border-0 shadow-xl shadow-gray-200/50 overflow-hidden">
                                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 md:p-8">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                                                <Award className="w-8 h-8 text-white" />
                                            </div>
                                            <div className="text-white">
                                                <p className="text-emerald-100 text-sm font-medium">{getText(content.bestMandi)}</p>
                                                <h3 className="text-2xl md:text-3xl font-bold">{priceData.best_mandi.name}</h3>
                                                <p className="text-emerald-100 mt-1">
                                                    {language === 'hi' ? priceData.best_mandi.reason_hi : priceData.best_mandi.reason_en}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-2xl px-6 py-4 text-center">
                                            <p className="text-gray-500 text-sm">{getText(content.perQuintal)}</p>
                                            <p className="text-4xl font-bold text-emerald-600">₹{priceData.best_mandi.price?.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )}

                        <div className="grid lg:grid-cols-2 gap-6">
                            {/* Price Chart */}
                            {chartData && (
                                <Card className="price-card border-0 shadow-xl shadow-gray-200/50">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                                                <BarChart3 className="w-5 h-5 text-amber-600" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900">{getText(content.priceComparison)}</h3>
                                        </div>
                                        <div className="h-64">
                                            <Bar data={chartData} options={chartOptions} />
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Price Table */}
                            <Card className="price-card border-0 shadow-xl shadow-gray-200/50">
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6">
                                        {language === 'hi' ? priceData.crop_name_hi : priceData.crop_name}
                                    </h3>
                                    <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                                        {priceData.prices?.map((price, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-amber-50 transition-colors">
                                                <div>
                                                    <p className="font-semibold text-gray-900">{price.mandi}</p>
                                                    <p className="text-sm text-gray-500">{price.district}, {price.state}</p>
                                                </div>
                                                <div className="text-right flex items-center gap-3">
                                                    <div>
                                                        <p className="text-xl font-bold text-amber-600">₹{price.modal_price?.toLocaleString()}</p>
                                                        <p className="text-xs text-gray-500">₹{price.min_price} - ₹{price.max_price}</p>
                                                    </div>
                                                    <div className={`p-2 rounded-lg ${getTrendBg(price.trend)}`}>
                                                        {getTrendIcon(price.trend)}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Market Advice */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {priceData.market_advice && (
                                <Card className="price-card border-0 shadow-xl shadow-gray-200/50 bg-gradient-to-br from-amber-50 to-orange-50">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                                                <IndianRupee className="w-6 h-6 text-amber-600" />
                                            </div>
                                            <h4 className="font-bold text-amber-800 text-lg">{getText(content.marketAdvice)}</h4>
                                        </div>
                                        <p className="text-gray-700 leading-relaxed">{getText(priceData.market_advice)}</p>
                                    </CardContent>
                                </Card>
                            )}
                            {priceData.weekly_trend && (
                                <Card className="price-card border-0 shadow-xl shadow-gray-200/50 bg-gradient-to-br from-sky-50 to-blue-50">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${priceData.weekly_trend.direction === 'up' ? 'bg-emerald-100' : priceData.weekly_trend.direction === 'down' ? 'bg-red-100' : 'bg-gray-100'}`}>
                                                {getTrendIcon(priceData.weekly_trend.direction)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-800 text-lg">{getText(content.trend)}</h4>
                                                <span className={`text-sm font-semibold ${priceData.weekly_trend.direction === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                                                    {priceData.weekly_trend.direction === 'up' ? '+' : ''}{priceData.weekly_trend.percentage}%
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 leading-relaxed">
                                            {language === 'hi' ? priceData.weekly_trend.analysis_hi : priceData.weekly_trend.analysis_en}
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
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