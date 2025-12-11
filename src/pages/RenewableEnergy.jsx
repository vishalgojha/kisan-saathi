import React, { useState, useEffect } from 'react';
import { Sun, Wind, Zap, TrendingUp, TrendingDown, IndianRupee, ArrowLeft, Loader2, Leaf, Battery, Home } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { LanguageProvider, useLanguage } from '../components/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function EnergyContent() {
    const { language } = useLanguage();
    const [profile, setProfile] = useState(null);
    const [farmArea, setFarmArea] = useState(5);
    const [predictions, setPredictions] = useState(null);
    const [loading, setLoading] = useState(false);

    const getText = (obj) => obj?.[language] || obj?.en || '';

    const content = {
        title: { hi: 'नवीकरणीय ऊर्जा विश्लेषण', en: 'Renewable Energy Analysis' },
        subtitle: { hi: 'अपने खेत के लिए सोलर और पवन ऊर्जा की क्षमता जानें', en: 'Discover solar and wind energy potential for your farm' },
        farmArea: { hi: 'खेत का क्षेत्रफल (एकड़)', en: 'Farm Area (acres)' },
        analyze: { hi: 'विश्लेषण करें', en: 'Analyze' },
        analyzing: { hi: 'विश्लेषण हो रहा है...', en: 'Analyzing...' },
        solarPotential: { hi: 'सोलर क्षमता', en: 'Solar Potential' },
        windPotential: { hi: 'पवन क्षमता', en: 'Wind Potential' },
        costAnalysis: { hi: 'लागत विश्लेषण', en: 'Cost Analysis' },
        seasonalOutput: { hi: 'मौसमी उत्पादन', en: 'Seasonal Output' },
        recommendations: { hi: 'सिफारिशें', en: 'Recommendations' },
        subsidies: { hi: 'सब्सिडी योजनाएं', en: 'Subsidy Schemes' },
        back: { hi: 'वापस', en: 'Back' },
        daily: { hi: 'दैनिक', en: 'Daily' },
        monthly: { hi: 'मासिक', en: 'Monthly' },
        yearly: { hi: 'वार्षिक', en: 'Yearly' },
        installation: { hi: 'स्थापना लागत', en: 'Installation Cost' },
        savings: { hi: 'मासिक बचत', en: 'Monthly Savings' },
        payback: { hi: 'पेबैक अवधि', en: 'Payback Period' },
        subsidy: { hi: 'सरकारी सब्सिडी', en: 'Govt Subsidy' },
        years: { hi: 'वर्ष', en: 'years' }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const profiles = await base44.entities.FarmerProfile.list();
            if (profiles.length > 0) {
                setProfile(profiles[0]);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchPredictions = async () => {
        if (!profile) return;
        setLoading(true);
        try {
            const res = await base44.functions.invoke('predictRenewableEnergy', {
                location: profile.location,
                state: profile.state,
                farm_area_acres: farmArea
            });
            setPredictions(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const seasonalData = predictions?.seasonal_output?.map(s => ({
        season: s.season,
        solar: s.solar_efficiency_percent,
        wind: s.wind_efficiency_percent
    })) || [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <Link to={createPageUrl('Dashboard')}>
                            <Button variant="ghost" className="gap-2 rounded-xl hover:bg-gray-100">
                                <ArrowLeft className="w-4 h-4" />
                                {getText(content.back)}
                            </Button>
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                                <Zap className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="text-xl font-bold text-gray-900 hidden sm:block">{getText(content.title)}</h1>
                        </div>
                        <LanguageToggle />
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-6xl">
                {/* Hero */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        {getText(content.title)}
                    </h2>
                    <p className="text-gray-600 text-lg">{getText(content.subtitle)}</p>
                </div>

                {/* Input Section */}
                {profile && (
                    <Card className="border-0 shadow-xl mb-8">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-4 items-end">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {getText(content.farmArea)}
                                    </label>
                                    <Input
                                        type="number"
                                        value={farmArea}
                                        onChange={(e) => setFarmArea(Number(e.target.value))}
                                        min="1"
                                        max="100"
                                        className="h-12 rounded-xl"
                                    />
                                </div>
                                <Button
                                    onClick={fetchPredictions}
                                    disabled={loading}
                                    className="h-12 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-xl px-8"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            {getText(content.analyzing)}
                                        </>
                                    ) : (
                                        <>
                                            <Zap className="w-5 h-5 mr-2" />
                                            {getText(content.analyze)}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Results */}
                {predictions && (
                    <div className="space-y-6">
                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white">
                                <CardContent className="p-6">
                                    <Sun className="w-10 h-10 mb-3 opacity-80" />
                                    <h4 className="font-bold text-lg mb-1">{getText(content.solarPotential)}</h4>
                                    <p className="text-3xl font-bold">{predictions.solar_potential?.yearly_kwh?.toLocaleString()} kWh</p>
                                    <p className="text-sm opacity-80 mt-1">{getText(content.yearly)}</p>
                                </CardContent>
                            </Card>

                            {predictions.wind_potential?.feasibility !== 'Not Feasible' && (
                                <Card className="border-0 shadow-lg bg-gradient-to-br from-sky-500 to-blue-600 text-white">
                                    <CardContent className="p-6">
                                        <Wind className="w-10 h-10 mb-3 opacity-80" />
                                        <h4 className="font-bold text-lg mb-1">{getText(content.windPotential)}</h4>
                                        <p className="text-3xl font-bold">{predictions.wind_potential?.yearly_kwh?.toLocaleString()} kWh</p>
                                        <p className="text-sm opacity-80 mt-1">{getText(content.yearly)}</p>
                                    </CardContent>
                                </Card>
                            )}

                            <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                                <CardContent className="p-6">
                                    <IndianRupee className="w-10 h-10 mb-3 opacity-80" />
                                    <h4 className="font-bold text-lg mb-1">{getText(content.savings)}</h4>
                                    <p className="text-3xl font-bold">₹{predictions.cost_analysis?.monthly_savings_inr?.toLocaleString()}</p>
                                    <p className="text-sm opacity-80 mt-1">{getText(content.monthly)}</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Cost Analysis */}
                        <Card className="border-0 shadow-xl">
                            <CardContent className="p-6">
                                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                    <IndianRupee className="w-6 h-6 text-emerald-600" />
                                    {getText(content.costAnalysis)}
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-xl">
                                        <p className="text-sm text-gray-600 mb-1">{getText(content.installation)}</p>
                                        <p className="text-xl font-bold text-gray-900">₹{predictions.cost_analysis?.solar_installation_cost_inr?.toLocaleString()}</p>
                                    </div>
                                    <div className="bg-emerald-50 p-4 rounded-xl">
                                        <p className="text-sm text-emerald-600 mb-1">{getText(content.savings)}</p>
                                        <p className="text-xl font-bold text-emerald-700">₹{predictions.cost_analysis?.monthly_savings_inr?.toLocaleString()}</p>
                                    </div>
                                    <div className="bg-amber-50 p-4 rounded-xl">
                                        <p className="text-sm text-amber-600 mb-1">{getText(content.payback)}</p>
                                        <p className="text-xl font-bold text-amber-700">{predictions.cost_analysis?.payback_period_years} {getText(content.years)}</p>
                                    </div>
                                    <div className="bg-blue-50 p-4 rounded-xl">
                                        <p className="text-sm text-blue-600 mb-1">{getText(content.subsidy)}</p>
                                        <p className="text-xl font-bold text-blue-700">₹{predictions.cost_analysis?.govt_subsidy_available_inr?.toLocaleString()}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Seasonal Output Chart */}
                        {seasonalData.length > 0 && (
                            <Card className="border-0 shadow-xl">
                                <CardContent className="p-6">
                                    <h3 className="text-2xl font-bold mb-6">{getText(content.seasonalOutput)}</h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={seasonalData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="season" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="solar" fill="#f59e0b" name={getText(content.solarPotential)} />
                                            <Bar dataKey="wind" fill="#0ea5e9" name={getText(content.windPotential)} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        )}

                        {/* Recommendations */}
                        {predictions.recommendations && (
                            <Card className="border-0 shadow-xl">
                                <CardContent className="p-6">
                                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                        <Leaf className="w-6 h-6 text-emerald-600" />
                                        {getText(content.recommendations)}
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="bg-amber-50 p-5 rounded-xl border border-amber-100">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Sun className="w-5 h-5 text-amber-600" />
                                                <h5 className="font-bold text-amber-900">{getText(content.solarPotential)}</h5>
                                            </div>
                                            <p className="text-gray-700">
                                                {language === 'hi' 
                                                    ? predictions.recommendations.solar_placement_hi 
                                                    : predictions.recommendations.solar_placement_en}
                                            </p>
                                        </div>
                                        {predictions.wind_potential?.feasibility !== 'Not Feasible' && (
                                            <div className="bg-sky-50 p-5 rounded-xl border border-sky-100">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Wind className="w-5 h-5 text-sky-600" />
                                                    <h5 className="font-bold text-sky-900">{getText(content.windPotential)}</h5>
                                                </div>
                                                <p className="text-gray-700">
                                                    {language === 'hi' 
                                                        ? predictions.recommendations.wind_placement_hi 
                                                        : predictions.recommendations.wind_placement_en}
                                                </p>
                                            </div>
                                        )}
                                        <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-100">
                                            <h5 className="font-bold text-emerald-900 mb-2">
                                                {language === 'hi' ? 'सर्वोत्तम विकल्प' : 'Best Option'}
                                            </h5>
                                            <p className="text-gray-700 mb-3">
                                                {language === 'hi' 
                                                    ? predictions.recommendations.best_option_hi 
                                                    : predictions.recommendations.best_option_en}
                                            </p>
                                            <ul className="space-y-2">
                                                {(language === 'hi' 
                                                    ? predictions.recommendations.additional_tips_hi 
                                                    : predictions.recommendations.additional_tips_en)?.map((tip, idx) => (
                                                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                                                        {tip}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Subsidies */}
                        {predictions.subsidies && predictions.subsidies.length > 0 && (
                            <Card className="border-0 shadow-xl">
                                <CardContent className="p-6">
                                    <h3 className="text-2xl font-bold mb-6">{getText(content.subsidies)}</h3>
                                    <div className="grid gap-4">
                                        {predictions.subsidies.map((subsidy, idx) => (
                                            <div key={idx} className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h5 className="font-bold text-blue-900">
                                                        {language === 'hi' ? subsidy.scheme_name_hi : subsidy.scheme_name_en}
                                                    </h5>
                                                    <Badge className="bg-blue-100 text-blue-700">
                                                        {subsidy.subsidy_percent}% {language === 'hi' ? 'सब्सिडी' : 'Subsidy'}
                                                    </Badge>
                                                </div>
                                                <p className="text-lg font-semibold text-blue-700">
                                                    {language === 'hi' ? 'अधिकतम राशि' : 'Max Amount'}: ₹{subsidy.max_amount_inr?.toLocaleString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}

                {!predictions && !loading && (
                    <Card className="border-0 shadow-xl">
                        <CardContent className="p-12 text-center">
                            <Zap className="w-16 h-16 mx-auto mb-4 text-amber-500" />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {language === 'hi' ? 'ऊर्जा विश्लेषण शुरू करें' : 'Start Energy Analysis'}
                            </h3>
                            <p className="text-gray-600">
                                {language === 'hi' 
                                    ? 'अपने खेत का क्षेत्रफल दर्ज करें और विश्लेषण बटन दबाएं' 
                                    : 'Enter your farm area and click analyze'}
                            </p>
                        </CardContent>
                    </Card>
                )}
            </main>
        </div>
    );
}

export default function RenewableEnergy() {
    return (
        <LanguageProvider>
            <EnergyContent />
        </LanguageProvider>
    );
}