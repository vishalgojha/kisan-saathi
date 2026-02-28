import { useMemo, useState } from 'react';
import { Cloud, CloudLightning, CloudRain, RefreshCw, Sun, Wind } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from './LanguageContext';

type WeatherForecastProps = {
    defaultLocation?: string;
};

type Condition = 'sunny' | 'cloudy' | 'rainy' | 'stormy';

type ForecastRow = {
    dayEn: string;
    dayHi: string;
    condition: Condition;
    high: number;
    low: number;
    rainChance: number;
    windKmph: number;
};

const dayNamesEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const dayNamesHi = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];

const baseLocations = [
    'Indore, MP',
    'Bhopal, MP',
    'Nashik, MH',
    'Pune, MH',
    'Jaipur, RJ',
    'Lucknow, UP',
    'Ludhiana, PB'
];

const conditionCycle: Condition[] = ['sunny', 'cloudy', 'rainy', 'cloudy', 'sunny', 'stormy', 'rainy'];

const hashText = (value: string) =>
    value.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

function buildForecast(location: string, refreshSeed: number): ForecastRow[] {
    const seed = hashText(`${location}:${refreshSeed}`);

    return Array.from({ length: 5 }).map((_, index) => {
        const date = new Date();
        date.setDate(date.getDate() + index);
        const conditionIndex = (seed + index) % conditionCycle.length;
        const condition = conditionCycle[conditionIndex];

        const baseline = 24 + ((seed + index * 5) % 11);
        const high = baseline + 3;
        const low = baseline - 5;
        const rainChance = condition === 'rainy' || condition === 'stormy'
            ? 55 + ((seed + index * 3) % 35)
            : 10 + ((seed + index * 4) % 30);
        const windKmph = 8 + ((seed + index * 7) % 18);

        return {
            dayEn: dayNamesEn[date.getDay()],
            dayHi: dayNamesHi[date.getDay()],
            condition,
            high,
            low,
            rainChance,
            windKmph
        };
    });
}

function getConditionLabel(condition: Condition, language: 'en' | 'hi') {
    const map = {
        sunny: { en: 'Sunny', hi: 'धूप' },
        cloudy: { en: 'Cloudy', hi: 'बादल' },
        rainy: { en: 'Rainy', hi: 'बारिश' },
        stormy: { en: 'Stormy', hi: 'आंधी/तूफान' }
    };
    return map[condition][language];
}

function getConditionIcon(condition: Condition, className: string) {
    if (condition === 'rainy') return <CloudRain className={className} />;
    if (condition === 'stormy') return <CloudLightning className={className} />;
    if (condition === 'cloudy') return <Cloud className={className} />;
    return <Sun className={className} />;
}

export default function WeatherForecast({ defaultLocation = 'Indore, MP' }: WeatherForecastProps) {
    const { language } = useLanguage();
    const [selectedLocation, setSelectedLocation] = useState(defaultLocation);
    const [refreshSeed, setRefreshSeed] = useState(0);

    const locationOptions = useMemo(() => {
        if (baseLocations.includes(defaultLocation)) return baseLocations;
        return [defaultLocation, ...baseLocations];
    }, [defaultLocation]);

    const forecast = useMemo(
        () => buildForecast(selectedLocation, refreshSeed),
        [selectedLocation, refreshSeed]
    );

    const current = forecast[0];

    const content = {
        title: { hi: 'मौसम पूर्वानुमान', en: 'Weather Forecast' },
        subtitle: { hi: 'वर्तमान मौसम और अगले 5 दिन', en: 'Current weather and next 5 days' },
        location: { hi: 'स्थान', en: 'Location' },
        rain: { hi: 'बारिश संभावना', en: 'Rain Chance' },
        wind: { hi: 'हवा', en: 'Wind' },
        refresh: { hi: 'रिफ्रेश', en: 'Refresh' },
        high: { hi: 'अधिकतम', en: 'High' },
        low: { hi: 'न्यूनतम', en: 'Low' },
        note: {
            hi: 'डेमो मौसम डेटा: सिंचाई/स्प्रे से पहले स्थानीय पूर्वानुमान जांचें।',
            en: 'Demo weather data: verify local forecast before irrigation/spray.'
        }
    };

    const getText = (obj: { hi: string; en: string }) => obj[language] || obj.en;

    return (
        <Card className="border-0 shadow-lg">
            <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <CloudRain className="w-5 h-5 text-sky-600" />
                            {getText(content.title)}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">{getText(content.subtitle)}</p>
                    </div>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setRefreshSeed((prev) => prev + 1)}
                        className="rounded-xl"
                    >
                        <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                        {getText(content.refresh)}
                    </Button>
                </div>

                <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-600 mb-2">{getText(content.location)}</p>
                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                        <SelectTrigger className="h-10 rounded-xl bg-gray-50 border-gray-200">
                            <SelectValue placeholder={getText(content.location)} />
                        </SelectTrigger>
                        <SelectContent>
                            {locationOptions.map((location) => (
                                <SelectItem key={location} value={location}>
                                    {location}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {current && (
                    <div className="rounded-2xl bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-100 p-4 mb-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <p className="text-xs text-sky-700 font-semibold">{selectedLocation}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    {getConditionIcon(current.condition, 'w-5 h-5 text-sky-600')}
                                    <p className="font-semibold text-gray-900">
                                        {getConditionLabel(current.condition, language)}
                                    </p>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    {getText(content.rain)}: {current.rainChance}% • {getText(content.wind)}: {current.windKmph} km/h
                                </p>
                            </div>
                            <Badge className="bg-white text-sky-700 border border-sky-200 text-sm px-3 py-1">
                                {current.high}° / {current.low}°
                            </Badge>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {forecast.map((day) => (
                        <div key={`${day.dayEn}-${day.high}-${day.low}`} className="rounded-xl border border-gray-100 bg-white p-3">
                            <p className="text-xs font-semibold text-gray-700">
                                {language === 'hi' ? day.dayHi : day.dayEn}
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                                {getConditionIcon(day.condition, 'w-4 h-4 text-sky-600')}
                                <p className="text-xs text-gray-600">
                                    {getConditionLabel(day.condition, language)}
                                </p>
                            </div>
                            <div className="mt-3 text-xs space-y-1">
                                <p className="text-gray-700">
                                    <span className="text-gray-500">{getText(content.high)}:</span> {day.high}°
                                </p>
                                <p className="text-gray-700">
                                    <span className="text-gray-500">{getText(content.low)}:</span> {day.low}°
                                </p>
                                <p className="text-gray-600">
                                    {day.rainChance}% rain
                                </p>
                                <p className="text-gray-600 flex items-center gap-1">
                                    <Wind className="w-3 h-3" /> {day.windKmph} km/h
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <p className="text-xs text-gray-500 mt-3">{getText(content.note)}</p>
            </CardContent>
        </Card>
    );
}
