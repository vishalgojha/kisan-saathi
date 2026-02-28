import React, { useState, useEffect } from 'react';
import { Sun, Wind, Zap, TrendingUp, Loader2, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { appClient } from '@/api/appClient';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

export default function DashboardEnergy({ location, state, language }) {
    const [predictions, setPredictions] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showTrend, setShowTrend] = useState(false);

    const getText = (obj) => obj?.[language] || obj?.en || '';

    const content = {
        title: { hi: 'ऊर्जा क्षमता', en: 'Energy Potential' },
        solar: { hi: 'सोलर', en: 'Solar' },
        wind: { hi: 'पवन', en: 'Wind' },
        perDay: { hi: 'प्रति दिन', en: 'per day' },
        viewDetails: { hi: 'पूरा विश्लेषण देखें', en: 'View Full Analysis' },
        noData: { hi: 'डेटा लोड हो रहा है...', en: 'Loading data...' }
    };

    useEffect(() => {
        if (location && state) fetchPredictions();
    }, [location, state]);

    const fetchPredictions = async () => {
        setLoading(true);
        try {
            const res = await appClient.functions.invoke('predictRenewableEnergy', { 
                location, 
                state,
                farm_area_acres: 5 
            });
            setPredictions(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Card className="border-0 shadow-lg">
                <CardContent className="p-6 flex items-center justify-center h-48">
                    <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                </CardContent>
            </Card>
        );
    }

    if (!predictions) {
        return (
            <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                    <p className="text-gray-500 text-center">{getText(content.noData)}</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-amber-500" />
                        {getText(content.title)}
                    </h3>
                </div>

                <div className="space-y-3">
                    {/* Solar */}
                    <div 
                        className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-100 cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => setShowTrend(!showTrend)}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Sun className="w-5 h-5 text-amber-600" />
                                <span className="font-semibold text-amber-900">{getText(content.solar)}</span>
                            </div>
                            <span className="text-2xl font-bold text-amber-700">
                                {predictions.solar_potential?.daily_kwh?.toFixed(1)} kWh
                            </span>
                        </div>
                        <p className="text-xs text-amber-700 opacity-80">{getText(content.perDay)}</p>
                    </div>

                    {/* 7-Day Trend Chart */}
                    {showTrend && predictions.daily_trends && (
                        <div className="bg-white p-4 rounded-xl border border-gray-200">
                            <h5 className="text-xs font-semibold text-gray-700 mb-3">
                                {language === 'hi' ? '7-दिन का रुझान' : '7-Day Trend'}
                            </h5>
                            <ResponsiveContainer width="100%" height={120}>
                                <LineChart data={predictions.daily_trends}>
                                    <XAxis 
                                        dataKey="date" 
                                        tick={{ fontSize: 10 }}
                                        tickFormatter={(value) => new Date(value).getDate() + ''}
                                    />
                                    <YAxis tick={{ fontSize: 10 }} width={30} />
                                    <Tooltip 
                                        contentStyle={{ fontSize: 12 }}
                                        formatter={(value) => `${value} kWh`}
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="solar_kwh" 
                                        stroke="#f59e0b" 
                                        strokeWidth={2}
                                        dot={{ r: 3 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {/* Wind */}
                    {predictions.wind_potential?.feasibility !== 'Not Feasible' && (
                        <div className="bg-gradient-to-r from-sky-50 to-blue-50 p-4 rounded-xl border border-sky-100">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <Wind className="w-5 h-5 text-sky-600" />
                                    <span className="font-semibold text-sky-900">{getText(content.wind)}</span>
                                </div>
                                <span className="text-2xl font-bold text-sky-700">
                                    {predictions.wind_potential?.daily_kwh?.toFixed(1)} kWh
                                </span>
                            </div>
                            <p className="text-xs text-sky-700 opacity-80">{getText(content.perDay)}</p>
                        </div>
                    )}

                    {/* Monthly Savings */}
                    {predictions.cost_analysis && (
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-xl border border-emerald-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                                    <span className="font-semibold text-emerald-900">
                                        {language === 'hi' ? 'मासिक बचत' : 'Monthly Savings'}
                                    </span>
                                </div>
                                <span className="text-2xl font-bold text-emerald-700">
                                    ₹{predictions.cost_analysis.monthly_savings_inr?.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                <Link to={createPageUrl('RenewableEnergy')}>
                    <Button variant="outline" className="w-full mt-4 rounded-xl border-amber-200 text-amber-700 hover:bg-amber-50">
                        {getText(content.viewDetails)}
                        <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}


