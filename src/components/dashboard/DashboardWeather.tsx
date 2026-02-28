import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Droplets, Wind, Loader2, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { appClient } from '@/api/appClient';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function DashboardWeather({ location, language }) {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    const getText = (obj) => obj?.[language] || obj?.en || '';

    const content = {
        title: { hi: 'आज का मौसम', en: "Today's Weather" },
        humidity: { hi: 'नमी', en: 'Humidity' },
        wind: { hi: 'हवा', en: 'Wind' },
        viewMore: { hi: 'विस्तार से देखें', en: 'View Details' }
    };

    useEffect(() => {
        if (location) fetchWeather();
    }, [location]);

    const fetchWeather = async () => {
        setLoading(true);
        try {
            const res = await appClient.functions.invoke('getWeather', { location, days: 3 });
            setWeather(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getWeatherIcon = (condition) => {
        const c = condition?.toLowerCase() || '';
        if (c.includes('rain')) return <CloudRain className="w-12 h-12 text-blue-500" />;
        if (c.includes('cloud')) return <Cloud className="w-12 h-12 text-gray-500" />;
        return <Sun className="w-12 h-12 text-amber-500" />;
    };

    if (loading) {
        return (
            <Card className="border-0 shadow-lg bg-gradient-to-br from-sky-500 to-blue-600 text-white">
                <CardContent className="p-6 flex items-center justify-center h-40">
                    <Loader2 className="w-8 h-8 animate-spin" />
                </CardContent>
            </Card>
        );
    }

    if (!weather) return null;

    return (
        <Card className="border-0 shadow-lg overflow-hidden bg-gradient-to-br from-sky-500 to-blue-600 text-white">
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-sky-100 text-sm">{getText(content.title)}</p>
                        <h3 className="text-lg font-semibold">{weather.location}</h3>
                    </div>
                    <Button variant="ghost" size="icon" onClick={fetchWeather} className="text-white hover:bg-white/20">
                        <RefreshCw className="w-4 h-4" />
                    </Button>
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                    {getWeatherIcon(weather.current?.condition)}
                    <div>
                        <p className="text-5xl font-light">{weather.current?.temperature}°</p>
                        <p className="text-sky-100">
                            {language === 'hi' ? weather.current?.condition_hi : weather.current?.condition}
                        </p>
                    </div>
                </div>

                <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2">
                        <Droplets className="w-4 h-4" />
                        <span>{weather.current?.humidity}%</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2">
                        <Wind className="w-4 h-4" />
                        <span>{weather.current?.wind_speed} km/h</span>
                    </div>
                </div>

                <Link to={createPageUrl('Weather')} className="block mt-4">
                    <Button variant="secondary" size="sm" className="w-full rounded-lg bg-white/20 hover:bg-white/30 text-white border-0">
                        {getText(content.viewMore)}
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}


