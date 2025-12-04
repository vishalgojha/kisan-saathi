import React, { useState } from 'react';
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer, Leaf, Loader2, MapPin, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import { LanguageProvider, useLanguage } from '../components/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

function WeatherContent() {
    const { language } = useLanguage();
    const [location, setLocation] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const content = {
        title: { hi: 'मौसम की जानकारी', en: 'Weather Information' },
        subtitle: { hi: 'अपने क्षेत्र का मौसम जानें', en: 'Know your area weather' },
        placeholder: { hi: 'अपना जिला/शहर डालें', en: 'Enter your district/city' },
        search: { hi: 'खोजें', en: 'Search' },
        current: { hi: 'अभी का मौसम', en: 'Current Weather' },
        forecast: { hi: 'आगे का मौसम', en: 'Forecast' },
        farmingTips: { hi: 'खेती सलाह', en: 'Farming Tips' },
        irrigation: { hi: 'सिंचाई सलाह', en: 'Irrigation Advice' },
        spray: { hi: 'छिड़काव सलाह', en: 'Spray Advice' },
        humidity: { hi: 'नमी', en: 'Humidity' },
        wind: { hi: 'हवा', en: 'Wind' },
        rain: { hi: 'बारिश संभावना', en: 'Rain Chance' },
        back: { hi: '← वापस', en: '← Back' }
    };

    const getText = (obj) => obj?.[language] || obj?.en || '';

    const getWeatherIcon = (condition) => {
        const lowerCondition = condition?.toLowerCase() || '';
        if (lowerCondition.includes('rain') || lowerCondition.includes('बारिश')) return <CloudRain className="w-12 h-12 text-blue-500" />;
        if (lowerCondition.includes('cloud') || lowerCondition.includes('बादल')) return <Cloud className="w-12 h-12 text-gray-500" />;
        return <Sun className="w-12 h-12 text-yellow-500" />;
    };

    const fetchWeather = async () => {
        if (!location.trim()) return;
        setLoading(true);
        setError(null);
        
        try {
            const response = await base44.functions.invoke('getWeather', { location, days: 5 });
            setWeatherData(response.data.data);
        } catch (err) {
            setError(language === 'hi' ? 'मौसम जानकारी नहीं मिली' : 'Could not fetch weather data');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-green-50">
            <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link to={createPageUrl('Home')}>
                        <Button variant="ghost" className="text-green-700">
                            {getText(content.back)}
                        </Button>
                    </Link>
                    <h1 className="text-xl font-bold text-blue-800">{getText(content.title)}</h1>
                    <LanguageToggle />
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Search Section */}
                <Card className="mb-8 border-blue-200">
                    <CardContent className="p-6">
                        <div className="flex gap-3">
                            <div className="relative flex-1">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    placeholder={getText(content.placeholder)}
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && fetchWeather()}
                                    className="pl-10 h-12 text-lg"
                                />
                            </div>
                            <Button 
                                onClick={fetchWeather} 
                                disabled={loading}
                                className="h-12 px-6 bg-blue-600 hover:bg-blue-700"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <Search className="w-5 h-5" />}
                                <span className="ml-2">{getText(content.search)}</span>
                            </Button>
                        </div>
                        {error && <p className="text-red-500 mt-3">{error}</p>}
                    </CardContent>
                </Card>

                {weatherData && (
                    <>
                        {/* Current Weather */}
                        <Card className="mb-6 border-blue-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold mb-1">{weatherData.location}</h2>
                                        <p className="text-blue-100">{getText(content.current)}</p>
                                    </div>
                                    {getWeatherIcon(weatherData.current?.condition)}
                                </div>
                                <div className="mt-4 flex items-end gap-4">
                                    <span className="text-6xl font-light">{weatherData.current?.temperature}°C</span>
                                    <span className="text-xl mb-2">
                                        {language === 'hi' ? weatherData.current?.condition_hi : weatherData.current?.condition}
                                    </span>
                                </div>
                            </div>
                            <CardContent className="p-4">
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div className="p-3 bg-blue-50 rounded-lg">
                                        <Droplets className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                                        <p className="text-sm text-gray-600">{getText(content.humidity)}</p>
                                        <p className="font-bold">{weatherData.current?.humidity}%</p>
                                    </div>
                                    <div className="p-3 bg-blue-50 rounded-lg">
                                        <Wind className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                                        <p className="text-sm text-gray-600">{getText(content.wind)}</p>
                                        <p className="font-bold">{weatherData.current?.wind_speed} km/h</p>
                                    </div>
                                    <div className="p-3 bg-blue-50 rounded-lg">
                                        <Thermometer className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                                        <p className="text-sm text-gray-600">Feels Like</p>
                                        <p className="font-bold">{weatherData.current?.temperature}°C</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Forecast */}
                        {weatherData.forecast && (
                            <Card className="mb-6 border-green-200">
                                <CardHeader>
                                    <CardTitle className="text-green-800">{getText(content.forecast)}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                        {weatherData.forecast.map((day, idx) => (
                                            <div key={idx} className="text-center p-3 bg-gradient-to-b from-blue-50 to-white rounded-lg border">
                                                <p className="font-medium text-sm">{language === 'hi' ? day.day_name_hi : day.day_name}</p>
                                                {getWeatherIcon(day.condition)}
                                                <p className="text-lg font-bold">{day.max_temp}°/{day.min_temp}°</p>
                                                <p className="text-xs text-blue-600">{getText(content.rain)}: {day.rain_chance}%</p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Farming Advisory */}
                        <div className="grid md:grid-cols-3 gap-4">
                            {weatherData.farming_advisory && (
                                <Card className="border-green-200">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm flex items-center gap-2 text-green-700">
                                            <Leaf className="w-4 h-4" />
                                            {getText(content.farmingTips)}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-gray-700">{getText(weatherData.farming_advisory)}</p>
                                    </CardContent>
                                </Card>
                            )}
                            {weatherData.irrigation_advice && (
                                <Card className="border-blue-200">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm flex items-center gap-2 text-blue-700">
                                            <Droplets className="w-4 h-4" />
                                            {getText(content.irrigation)}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-gray-700">{getText(weatherData.irrigation_advice)}</p>
                                    </CardContent>
                                </Card>
                            )}
                            {weatherData.spray_advice && (
                                <Card className="border-amber-200">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm flex items-center gap-2 text-amber-700">
                                            <Cloud className="w-4 h-4" />
                                            {getText(content.spray)}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-gray-700">{getText(weatherData.spray_advice)}</p>
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

export default function Weather() {
    return (
        <LanguageProvider>
            <WeatherContent />
        </LanguageProvider>
    );
}