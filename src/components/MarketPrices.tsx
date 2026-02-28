import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ArrowDown, ArrowUp, CalendarDays, MapPin, Minus, RefreshCw, RotateCcw, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createMarketPricesAdapter, MARKET_MANDI_DIRECTORY, type Trend, type TrendRow } from '@/adapters/marketPricesAdapter';
import { getLocalizedText, type SupportedLanguage } from '@/adapters/types/common';
import { useLanguage } from './LanguageContext';

type MarketPricesProps = {
    crops?: string[];
    defaultState?: string;
};

const cropDefaults = ['Wheat', 'Rice', 'Soybean', 'Maize'];

const formatINR = (value: number) =>
    new Intl.NumberFormat('en-IN').format(Math.round(value));

const asLanguage = (value: string): SupportedLanguage => (value === 'en' ? 'en' : 'hi');

export default function MarketPrices({ crops = [], defaultState = 'Madhya Pradesh' }: MarketPricesProps) {
    const { language } = useLanguage();
    const safeLanguage = asLanguage(language);
    const adapter = useMemo(() => createMarketPricesAdapter(), []);

    const [refreshKey, setRefreshKey] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [snapshot, setSnapshot] = useState<Awaited<ReturnType<typeof adapter.getSnapshot>> | null>(null);

    const cropOptions = useMemo(() => (crops.length > 0 ? crops : cropDefaults), [crops]);
    const stateOptions = useMemo(() => Object.keys(MARKET_MANDI_DIRECTORY), []);
    const initialState = stateOptions.includes(defaultState) ? defaultState : stateOptions[0] || 'Madhya Pradesh';

    const [selectedCrop, setSelectedCrop] = useState(cropOptions[0] || 'Wheat');
    const [selectedState, setSelectedState] = useState(initialState);

    const mandiOptions = useMemo(() => MARKET_MANDI_DIRECTORY[selectedState] || [], [selectedState]);
    const [selectedMandi, setSelectedMandi] = useState(mandiOptions[0]?.mandi || '');

    const content = {
        title: { hi: 'मार्केट प्राइस कार्ड', en: 'Market Prices' },
        subtitle: {
            hi: 'राज्य, फसल और मंडी चुनें; मॉक/लाइव भाव और रुझान देखें',
            en: 'Select state, crop, and mandi to view mock/live rates and trends',
        },
        state: { hi: 'राज्य', en: 'State' },
        crop: { hi: 'फसल', en: 'Crop' },
        mandi: { hi: 'मंडी', en: 'Mandi' },
        refresh: { hi: 'रिफ्रेश', en: 'Refresh' },
        retry: { hi: 'फिर से कोशिश करें', en: 'Retry' },
        todayRate: { hi: 'आज का भाव', en: 'Today Rate' },
        weekHigh: { hi: 'साप्ताहिक उच्च', en: 'Week High' },
        weekLow: { hi: 'साप्ताहिक निम्न', en: 'Week Low' },
        trend: { hi: 'रुझान', en: 'Trend' },
        district: { hi: 'जिला', en: 'District' },
        date: { hi: 'तारीख', en: 'Date' },
        min: { hi: 'न्यूनतम', en: 'Min' },
        modal: { hi: 'मॉडल', en: 'Modal' },
        max: { hi: 'अधिकतम', en: 'Max' },
        nearby: { hi: 'नजदीकी मंडियां', en: 'Nearby Mandis' },
        up: { hi: 'ऊपर', en: 'Up' },
        down: { hi: 'नीचे', en: 'Down' },
        stable: { hi: 'स्थिर', en: 'Stable' },
        perQuintal: { hi: 'रु/क्विंटल', en: 'Rs/Quintal' },
        note: {
            hi: 'डेमो/एडाप्टर डेटा: वास्तविक लेनदेन से पहले स्थानीय मंडी रेट की पुष्टि करें।',
            en: 'Demo/adapter data: verify local mandi rates before real transactions.',
        },
        updated: { hi: 'अपडेट', en: 'Updated' },
        loading: { hi: 'भाव डेटा लोड हो रहा है...', en: 'Loading price data...' },
        validation: { hi: 'राज्य, फसल और मंडी चुनें।', en: 'Select state, crop, and mandi.' },
        serviceError: {
            hi: 'मार्केट प्राइस सेवा अभी उपलब्ध नहीं है।',
            en: 'Market prices service is currently unavailable.',
        },
        empty: {
            hi: 'इस चयन के लिए कोई भाव डेटा नहीं मिला।',
            en: 'No price data found for this selection.',
        },
    };

    const getText = (text: { hi: string; en: string }) => getLocalizedText(text, safeLanguage);

    useEffect(() => {
        if (!cropOptions.includes(selectedCrop)) {
            setSelectedCrop(cropOptions[0] || 'Wheat');
        }
    }, [cropOptions, selectedCrop]);

    useEffect(() => {
        if (!stateOptions.includes(selectedState)) {
            setSelectedState(initialState);
        }
    }, [stateOptions, selectedState, initialState]);

    useEffect(() => {
        if (mandiOptions.length === 0) {
            setSelectedMandi('');
            return;
        }
        if (!mandiOptions.some((item) => item.mandi === selectedMandi)) {
            setSelectedMandi(mandiOptions[0].mandi);
        }
    }, [mandiOptions, selectedMandi]);

    const fetchSnapshot = useCallback(async () => {
        if (!selectedCrop || !selectedState || !selectedMandi) {
            setError(getText(content.validation));
            return;
        }

        setError('');
        setIsLoading(true);
        try {
            const data = await adapter.getSnapshot({
                crop: selectedCrop,
                state: selectedState,
                mandi: selectedMandi,
                language: safeLanguage,
                refreshKey,
            });
            setSnapshot(data);
        } catch {
            setError(getText(content.serviceError));
            setSnapshot(null);
        } finally {
            setIsLoading(false);
        }
    }, [adapter, selectedCrop, selectedState, selectedMandi, safeLanguage, refreshKey]);

    useEffect(() => {
        fetchSnapshot();
    }, [fetchSnapshot]);

    const trendRows: TrendRow[] = snapshot?.trendRows || [];
    const latest = trendRows[trendRows.length - 1];
    const previous = trendRows[trendRows.length - 2];
    const latestDelta = latest && previous ? latest.modalPrice - previous.modalPrice : 0;
    const weekTrend: Trend = latestDelta > 0 ? 'up' : latestDelta < 0 ? 'down' : 'stable';
    const weekHigh = trendRows.reduce((max, row) => Math.max(max, row.maxPrice), 0);
    const weekLow = trendRows.reduce((min, row) => Math.min(min, row.minPrice), Number.MAX_SAFE_INTEGER);

    const getTrendIcon = (trend: Trend) => {
        if (trend === 'up') return <ArrowUp className="w-3.5 h-3.5 text-emerald-600" />;
        if (trend === 'down') return <ArrowDown className="w-3.5 h-3.5 text-red-600" />;
        return <Minus className="w-3.5 h-3.5 text-gray-500" />;
    };

    const getTrendLabel = (trend: Trend) => {
        if (trend === 'up') return getText(content.up);
        if (trend === 'down') return getText(content.down);
        return getText(content.stable);
    };

    return (
        <Card className="border-0 shadow-lg" data-testid="market-prices">
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
                        data-testid="market-refresh"
                    >
                        <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                        {getText(content.refresh)}
                    </Button>
                </div>

                <div className="grid md:grid-cols-3 gap-3 mb-4">
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
                                {cropOptions.map((crop) => (
                                    <SelectItem key={crop} value={crop}>
                                        {crop}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-600 mb-2">{getText(content.mandi)}</p>
                        <Select value={selectedMandi} onValueChange={setSelectedMandi}>
                            <SelectTrigger className="h-10 rounded-xl bg-gray-50 border-gray-200">
                                <SelectValue placeholder={getText(content.mandi)} />
                            </SelectTrigger>
                            <SelectContent>
                                {mandiOptions.map((item) => (
                                    <SelectItem key={item.mandi} value={item.mandi}>
                                        {item.mandi}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {isLoading && <p className="text-sm text-gray-600 mb-3">{getText(content.loading)}</p>}

                {error && (
                    <div className="mb-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 flex items-start justify-between gap-3">
                        <span className="inline-flex items-center gap-1">
                            <AlertTriangle className="w-4 h-4 mt-0.5" />
                            {error}
                        </span>
                        <Button size="sm" variant="outline" className="h-7 rounded-lg" onClick={fetchSnapshot}>
                            <RotateCcw className="w-3.5 h-3.5 mr-1" />
                            {getText(content.retry)}
                        </Button>
                    </div>
                )}

                {!isLoading && !error && trendRows.length === 0 && (
                    <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 flex items-start justify-between gap-3">
                        <span>{getText(content.empty)}</span>
                        <Button size="sm" variant="outline" className="h-7 rounded-lg" onClick={fetchSnapshot}>
                            <RotateCcw className="w-3.5 h-3.5 mr-1" />
                            {getText(content.retry)}
                        </Button>
                    </div>
                )}

                {!error && trendRows.length > 0 && (
                    <>
                        <div className="rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 p-4 mb-4">
                            <div className="flex flex-wrap justify-between gap-3">
                                <div>
                                    <p className="font-semibold text-gray-900 flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5 text-amber-600" />
                                        {selectedMandi}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {getText(content.district)}: {snapshot?.district || '-'}
                                    </p>
                                </div>
                                <p className="text-xs text-gray-500">
                                    {getText(content.updated)}:{' '}
                                    {new Date(snapshot?.updatedAt || Date.now()).toLocaleTimeString('en-IN', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 text-sm">
                                <div className="rounded-xl bg-white/80 border border-amber-100 p-2.5" data-testid="market-today-rate">
                                    <p className="text-xs text-gray-500">{getText(content.todayRate)}</p>
                                    <p className="font-semibold text-amber-700">Rs {formatINR(latest?.modalPrice || 0)}</p>
                                </div>
                                <div className="rounded-xl bg-white/80 border border-amber-100 p-2.5">
                                    <p className="text-xs text-gray-500">{getText(content.weekHigh)}</p>
                                    <p className="font-semibold text-emerald-700">Rs {formatINR(weekHigh)}</p>
                                </div>
                                <div className="rounded-xl bg-white/80 border border-amber-100 p-2.5">
                                    <p className="text-xs text-gray-500">{getText(content.weekLow)}</p>
                                    <p className="font-semibold text-slate-700">Rs {formatINR(weekLow)}</p>
                                </div>
                                <div className="rounded-xl bg-white/80 border border-amber-100 p-2.5">
                                    <p className="text-xs text-gray-500">{getText(content.trend)}</p>
                                    <p className="font-semibold inline-flex items-center gap-1">
                                        {getTrendIcon(weekTrend)}
                                        {getTrendLabel(weekTrend)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-100 mb-4">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr className="text-left text-gray-600">
                                        <th className="px-3 py-2 font-medium">{getText(content.date)}</th>
                                        <th className="px-3 py-2 font-medium">{getText(content.mandi)}</th>
                                        <th className="px-3 py-2 font-medium">{getText(content.min)}</th>
                                        <th className="px-3 py-2 font-medium">{getText(content.modal)}</th>
                                        <th className="px-3 py-2 font-medium">{getText(content.max)}</th>
                                        <th className="px-3 py-2 font-medium">{getText(content.trend)}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {trendRows.map((row) => (
                                        <tr key={`${row.dateLabel}-${row.mandi}`} className="border-t border-gray-100" data-testid="market-trend-row">
                                            <td className="px-3 py-2 text-gray-800">{row.dateLabel}</td>
                                            <td className="px-3 py-2 text-gray-600">{row.mandi}</td>
                                            <td className="px-3 py-2">Rs {formatINR(row.minPrice)}</td>
                                            <td className="px-3 py-2 font-semibold text-amber-700">Rs {formatINR(row.modalPrice)}</td>
                                            <td className="px-3 py-2">Rs {formatINR(row.maxPrice)}</td>
                                            <td className="px-3 py-2">
                                                <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs">
                                                    {getTrendIcon(row.trend)}
                                                    {getTrendLabel(row.trend)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="md:hidden space-y-2 mb-4">
                            {trendRows.map((row) => (
                                <div key={`${row.dateLabel}-${row.mandi}`} className="rounded-xl border border-gray-100 bg-white p-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="font-semibold text-gray-900">{row.dateLabel}</p>
                                            <p className="text-xs text-gray-500">{row.mandi}</p>
                                        </div>
                                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs">
                                            {getTrendIcon(row.trend)}
                                            {getTrendLabel(row.trend)}
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

                        <div>
                            <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                                <CalendarDays className="w-3.5 h-3.5" />
                                {getText(content.nearby)}
                            </p>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
                                {snapshot?.nearbyCards.map((card) => (
                                    <div key={card.label} className="rounded-xl border border-gray-100 bg-white p-3">
                                        <p className="text-xs text-gray-500 truncate">{card.label}</p>
                                        <p className="font-semibold text-gray-900 mt-1">Rs {formatINR(card.value)}</p>
                                        <p className="text-xs mt-1 inline-flex items-center gap-1">
                                            {getTrendIcon(card.trend)}
                                            {getTrendLabel(card.trend)} ({card.delta > 0 ? '+' : ''}{card.delta}%)
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                <p className="text-xs text-gray-500 mt-3">
                    {getText(content.perQuintal)} • {getText(content.note)}
                </p>
            </CardContent>
        </Card>
    );
}
