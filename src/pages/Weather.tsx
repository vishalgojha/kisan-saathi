import React, { useState, useEffect, useRef } from 'react';
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer, Leaf, Loader2, MapPin, Search, Sprout, ArrowLeft, CloudSun, Umbrella } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { appClient } from '@/api/appClient';
import { LanguageProvider, useLanguage } from '../components/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import gsap from 'gsap';
import dayjs from 'dayjs';

function WeatherContent() {
    const { language } = useLanguage();
    const [location, setLocation] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const containerRef = useRef(null);

    useEffect(() => {
        if (weatherData) {
            gsap.from('.weather-card', {
                y: 30,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power3.out'
            });
        }
    }, [weatherData]);

    const content = {
        title: { hi: 'मौसम इंटेलिजेंस', en: 'Weather Intelligence' },
        subtitle: { hi: 'AI-संचालित मौसम पूर्वानुमान और खेती सलाह', en: 'AI-powered weather forecast & farming advice' },
        placeholder: { hi: 'अपना जिला या शहर लिखें...', en: 'Enter your district or city...' },
        search: { hi: 'मौसम देखें', en: 'Get Weather' },
        current: { hi: 'अभी का मौसम', en: 'Current Weather' },
        forecast: { hi: '5-दिन पूर्वानुमान', en: '5-Day Forecast' },
        farmingTips: { hi: 'खेती सलाह', en: 'Farming Advisory' },
        irrigation: { hi: 'सिंचाई सलाह', en: 'Irrigation Advice' },
        spray: { hi: 'छिड़काव सलाह', en: 'Spray Advisory' },
        humidity: { hi: 'नमी', en: 'Humidity' },
        wind: { hi: 'हवा', en: 'Wind' },
        rain: { hi: 'बारिश', en: 'Rain' },
        back: { hi: 'वापस', en: 'Back' }
    };

    const getText = (obj) => obj?.[language] || obj?.en || '';

    const getWeatherIcon = (condition, size = 'large') => {
        const lowerCondition = condition?.toLowerCase() || '';
        const iconClass = size === 'large' ? 'w-20 h-20' : 'w-10 h-10';
        if (lowerCondition.includes('rain') || lowerCondition.includes('बारिश')) 
            return <CloudRain className={`${iconClass} text-blue-500`} />;
        if (lowerCondition.includes('cloud') || lowerCondition.includes('बादल')) 
            return <CloudSun className={`${iconClass} text-gray-500`} />;
        return <Sun className={`${iconClass} text-amber-500`} />;
    };

    const fetchWeather = async () => {
        if (!location.trim()) return;
        setLoading(true);
        setError(null);
        
        try {
            const response = await appClient.functions.invoke('getWeather', { location, days: 5 });
            setWeatherData(response.data.data);
        } catch (err) {
            setError(language === 'hi' ? 'मौसम जानकारी नहीं मिली' : 'Could not fetch weather data');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
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
                            <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center">
                                <CloudRain className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="text-xl font-bold text-gray-900 hidden sm:block">{getText(content.title)}</h1>
                        </div>
                        <LanguageToggle />
                    </div>
                </div>
            </header>

            <main ref={containerRef} className="container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-5xl">
                {/* Hero Search */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        {getText(content.title)}
                    </h2>
                    <p className="text-gray-600 text-lg mb-8">{getText(content.subtitle)}</p>
                    
                    <div className="max-w-xl mx-auto">
                        <div className="flex gap-3 p-2 bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100">
                            <div className="relative flex-1">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    placeholder={getText(content.placeholder)}
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && fetchWeather()}
                                    className="pl-12 h-14 text-lg border-0 bg-transparent focus-visible:ring-0"
                                />
                            </div>
                            <Button 
                                onClick={fetchWeather} 
                                disabled={loading}
                                className="h-14 px-8 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 rounded-xl text-lg shadow-lg shadow-blue-500/25"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <Search className="w-5 h-5" />}
                            </Button>
                        </div>
                        {error && <p className="text-red-500 mt-4 bg-red-50 py-2 px-4 rounded-lg inline-block">{error}</p>}
                    </div>
                </div>

                {weatherData && (
                    <div className="space-y-6">
                        {/* Current Weather Card */}
                        <Card className="weather-card overflow-hidden border-0 shadow-xl shadow-gray-200/50">
                            <div className="bg-gradient-to-br from-sky-500 via-blue-500 to-blue-600 text-white p-8 md:p-10">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                    <div>
                                        <p className="text-sky-100 text-sm font-medium mb-1">{dayjs().format('dddd, MMMM D')}</p>
                                        <h2 className="text-3xl md:text-4xl font-bold mb-2">{weatherData.location}</h2>
                                        <p className="text-xl text-sky-100">
                                            {language === 'hi' ? weatherData.current?.condition_hi : weatherData.current?.condition}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {getWeatherIcon(weatherData.current?.condition)}
                                        <span className="text-7xl md:text-8xl font-light">{weatherData.current?.temperature}°</span>
                                    </div>
                                </div>
                            </div>
                            <CardContent className="p-6 bg-white">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center p-4 bg-sky-50 rounded-2xl">
                                        <Droplets className="w-7 h-7 text-sky-500 mx-auto mb-2" />
                                        <p className="text-xs text-gray-500 mb-1">{getText(content.humidity)}</p>
                                        <p className="text-xl font-bold text-gray-900">{weatherData.current?.humidity}%</p>
                                    </div>
                                    <div className="text-center p-4 bg-sky-50 rounded-2xl">
                                        <Wind className="w-7 h-7 text-sky-500 mx-auto mb-2" />
                                        <p className="text-xs text-gray-500 mb-1">{getText(content.wind)}</p>
                                        <p className="text-xl font-bold text-gray-900">{weatherData.current?.wind_speed} km/h</p>
                                    </div>
                                    <div className="text-center p-4 bg-sky-50 rounded-2xl">
                                        <Umbrella className="w-7 h-7 text-sky-500 mx-auto mb-2" />
                                        <p className="text-xs text-gray-500 mb-1">{getText(content.rain)}</p>
                                        <p className="text-xl font-bold text-gray-900">{weatherData.forecast?.[0]?.rain_chance || 0}%</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Forecast */}
                        {weatherData.forecast && (
                            <Card className="weather-card border-0 shadow-xl shadow-gray-200/50">
                                <CardContent className="p-4 md:p-6">
                                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">{getText(content.forecast)}</h3>
                                    <div className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-3">
                                        {weatherData.forecast.slice(0, 5).map((day, idx) => (
                                            <div key={idx} className={`text-center p-3 md:p-4 bg-gradient-to-b from-gray-50 to-white rounded-xl md:rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow ${idx >= 3 ? 'hidden md:block' : ''}`}>
                                                <p className="font-semibold text-gray-700 text-xs md:text-sm mb-2 md:mb-3">
                                                    {language === 'hi' ? day.day_name_hi : day.day_name}
                                                </p>
                                                {getWeatherIcon(day.condition, 'small')}
                                                <div className="mt-2 md:mt-3">
                                                    <span className="text-base md:text-lg font-bold text-gray-900">{day.max_temp}°</span>
                                                    <span className="text-gray-400 mx-0.5 md:mx-1">/</span>
                                                    <span className="text-gray-500 text-sm">{day.min_temp}°</span>
                                                </div>
                                                <p className="text-xs text-blue-600 mt-2 bg-blue-50 py-1 px-1.5 md:px-2 rounded-full">
                                                    <Droplets className="w-3 h-3 inline mr-0.5 md:mr-1" />
                                                    {day.rain_chance}%
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Advisory Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {weatherData.farming_advisory && (
                                <Card className="weather-card border-0 shadow-xl shadow-gray-200/50 bg-gradient-to-br from-emerald-50 to-green-50">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                                <Leaf className="w-6 h-6 text-emerald-600" />
                                            </div>
                                            <h4 className="font-bold text-emerald-800">{getText(content.farmingTips)}</h4>
                                        </div>
                                        <p className="text-gray-700 leading-relaxed">{getText(weatherData.farming_advisory)}</p>
                                    </CardContent>
                                </Card>
                            )}
                            {weatherData.irrigation_advice && (
                                <Card className="weather-card border-0 shadow-xl shadow-gray-200/50 bg-gradient-to-br from-sky-50 to-blue-50">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center">
                                                <Droplets className="w-6 h-6 text-sky-600" />
                                            </div>
                                            <h4 className="font-bold text-sky-800">{getText(content.irrigation)}</h4>
                                        </div>
                                        <p className="text-gray-700 leading-relaxed">{getText(weatherData.irrigation_advice)}</p>
                                    </CardContent>
                                </Card>
                            )}
                            {weatherData.spray_advice && (
                                <Card className="weather-card border-0 shadow-xl shadow-gray-200/50 bg-gradient-to-br from-amber-50 to-orange-50">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                                                <Cloud className="w-6 h-6 text-amber-600" />
                                            </div>
                                            <h4 className="font-bold text-amber-800">{getText(content.spray)}</h4>
                                        </div>
                                        <p className="text-gray-700 leading-relaxed">{getText(weatherData.spray_advice)}</p>
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

export default function Weather() {
    return (
        <LanguageProvider>
            <WeatherContent />
        </LanguageProvider>
    );
}


