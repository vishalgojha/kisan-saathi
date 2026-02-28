import { appClient } from '@/api/appClient';
import { getDataMode } from './dataMode';
import type { SupportedLanguage } from './types/common';

export type Trend = 'up' | 'down' | 'stable';

export type MandiInfo = {
    mandi: string;
    district: string;
};

export type PriceCard = {
    label: string;
    value: number;
    trend: Trend;
    delta: number;
};

export type TrendRow = {
    dateLabel: string;
    mandi: string;
    minPrice: number;
    modalPrice: number;
    maxPrice: number;
    trend: Trend;
};

export type MarketSnapshot = {
    trendRows: TrendRow[];
    nearbyCards: PriceCard[];
    district: string;
    updatedAt: string;
};

export type MarketQuery = {
    crop: string;
    state: string;
    mandi: string;
    language: SupportedLanguage;
    refreshKey: number;
};

export interface MarketPricesAdapter {
    getSnapshot: (query: MarketQuery) => Promise<MarketSnapshot>;
}

export const MARKET_MANDI_DIRECTORY: Record<string, MandiInfo[]> = {
    'Madhya Pradesh': [
        { mandi: 'Indore APMC', district: 'Indore' },
        { mandi: 'Bhopal APMC', district: 'Bhopal' },
        { mandi: 'Ujjain APMC', district: 'Ujjain' },
        { mandi: 'Dewas APMC', district: 'Dewas' },
    ],
    Maharashtra: [
        { mandi: 'Nashik APMC', district: 'Nashik' },
        { mandi: 'Pune APMC', district: 'Pune' },
        { mandi: 'Nagpur APMC', district: 'Nagpur' },
        { mandi: 'Jalgaon APMC', district: 'Jalgaon' },
    ],
    'Uttar Pradesh': [
        { mandi: 'Kanpur APMC', district: 'Kanpur' },
        { mandi: 'Lucknow APMC', district: 'Lucknow' },
        { mandi: 'Varanasi APMC', district: 'Varanasi' },
        { mandi: 'Agra APMC', district: 'Agra' },
    ],
    Rajasthan: [
        { mandi: 'Jaipur APMC', district: 'Jaipur' },
        { mandi: 'Kota APMC', district: 'Kota' },
        { mandi: 'Ajmer APMC', district: 'Ajmer' },
        { mandi: 'Alwar APMC', district: 'Alwar' },
    ],
    Punjab: [
        { mandi: 'Ludhiana APMC', district: 'Ludhiana' },
        { mandi: 'Patiala APMC', district: 'Patiala' },
        { mandi: 'Amritsar APMC', district: 'Amritsar' },
        { mandi: 'Bathinda APMC', district: 'Bathinda' },
    ],
    Haryana: [
        { mandi: 'Karnal APMC', district: 'Karnal' },
        { mandi: 'Hisar APMC', district: 'Hisar' },
        { mandi: 'Rohtak APMC', district: 'Rohtak' },
        { mandi: 'Sirsa APMC', district: 'Sirsa' },
    ],
    Gujarat: [
        { mandi: 'Ahmedabad APMC', district: 'Ahmedabad' },
        { mandi: 'Rajkot APMC', district: 'Rajkot' },
        { mandi: 'Surat APMC', district: 'Surat' },
        { mandi: 'Vadodara APMC', district: 'Vadodara' },
    ],
};

const cropBasePrices: Record<string, number> = {
    wheat: 2420,
    rice: 2680,
    soybean: 5220,
    gram: 5480,
    maize: 2140,
    mustard: 6120,
    cotton: 7480,
    onion: 1720,
    tomato: 1640,
    potato: 1530,
};

const hashText = (value: string) =>
    value.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);

const trendFromDelta = (delta: number): Trend => {
    if (delta > 0) return 'up';
    if (delta < 0) return 'down';
    return 'stable';
};

const getDateLabel = (offset: number, language: SupportedLanguage) => {
    const date = new Date();
    date.setDate(date.getDate() - offset);
    if (offset === 0) return language === 'hi' ? 'आज' : 'Today';
    if (offset === 1) return language === 'hi' ? 'कल' : 'Yesterday';
    return date.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', {
        day: '2-digit',
        month: 'short',
    });
};

const buildTrendRows = (query: MarketQuery): TrendRow[] => {
    const normalizedCrop = query.crop.trim().toLowerCase();
    const base = cropBasePrices[normalizedCrop] || 2500;
    const seed = hashText(`${query.state}:${query.mandi}:${normalizedCrop}:${query.refreshKey}`);
    const rows: TrendRow[] = [];

    for (let dayOffset = 6; dayOffset >= 0; dayOffset -= 1) {
        const dayFactor = (seed + dayOffset * 19) % 260;
        const deviation = dayFactor - 130;
        const modalPrice = Math.max(500, base + deviation);
        const minPrice = Math.max(350, modalPrice - (110 + (dayOffset % 3) * 20));
        const maxPrice = modalPrice + (120 + (dayOffset % 4) * 15);
        const delta = ((seed + dayOffset * 7) % 3) - 1;

        rows.push({
            dateLabel: getDateLabel(dayOffset, query.language),
            mandi: query.mandi,
            minPrice,
            modalPrice,
            maxPrice,
            trend: trendFromDelta(delta),
        });
    }

    return rows;
};

const buildNearbyCards = (query: MarketQuery): PriceCard[] => {
    const normalizedCrop = query.crop.trim().toLowerCase();
    const base = cropBasePrices[normalizedCrop] || 2500;
    const mandis = MARKET_MANDI_DIRECTORY[query.state] || [];

    return mandis.map((item, index) => {
        const seed = hashText(`${item.mandi}:${query.state}:${normalizedCrop}:${query.refreshKey}`);
        const variation = ((seed + index * 23) % 241) - 120;
        const value = Math.max(500, base + variation);
        const delta = ((seed + index * 17) % 9) - 4;
        return {
            label: item.mandi,
            value,
            trend: trendFromDelta(delta),
            delta,
        };
    });
};

const mockAdapter: MarketPricesAdapter = {
    async getSnapshot(query) {
        const district =
            MARKET_MANDI_DIRECTORY[query.state]?.find((item) => item.mandi === query.mandi)?.district || '';

        return {
            trendRows: buildTrendRows(query),
            nearbyCards: buildNearbyCards(query),
            district,
            updatedAt: new Date().toISOString(),
        };
    },
};

const toLiveTrendRows = (
    selectedMandi: string,
    modalPrice: number,
    language: SupportedLanguage,
    seedBase: string
): TrendRow[] => {
    const rows: TrendRow[] = [];
    const seed = hashText(seedBase);
    for (let dayOffset = 6; dayOffset >= 0; dayOffset -= 1) {
        const shift = ((seed + dayOffset * 13) % 111) - 55;
        const dayModal = Math.max(500, modalPrice + shift);
        rows.push({
            dateLabel: getDateLabel(dayOffset, language),
            mandi: selectedMandi,
            minPrice: Math.max(350, dayModal - 100),
            modalPrice: dayModal,
            maxPrice: dayModal + 110,
            trend: trendFromDelta(((seed + dayOffset) % 3) - 1),
        });
    }
    return rows;
};

const liveAdapter: MarketPricesAdapter = {
    async getSnapshot(query) {
        const district =
            MARKET_MANDI_DIRECTORY[query.state]?.find((item) => item.mandi === query.mandi)?.district || '';
        const response = await appClient.functions.invoke('getMandiPrices', {
            crop: query.crop,
            state: query.state,
            district,
        });
        const payload = response?.data?.data as Record<string, any>;
        const rawRows = Array.isArray(payload?.prices) ? payload.prices : [];
        if (rawRows.length === 0) {
            return {
                trendRows: [],
                nearbyCards: [],
                district,
                updatedAt: new Date().toISOString(),
            };
        }

        const selectedRow = rawRows.find((row: Record<string, unknown>) => String(row?.mandi) === query.mandi) || rawRows[0];
        const selectedMandi = String(selectedRow?.mandi || query.mandi);
        const selectedModal = Number(selectedRow?.modal_price || selectedRow?.modalPrice || 0);

        const nearbyCards: PriceCard[] = rawRows.slice(0, 4).map((row: Record<string, any>, index: number) => {
            const modal = Number(row?.modal_price || row?.modalPrice || 0);
            const delta = ((index + hashText(String(row?.mandi || ''))) % 9) - 4;
            return {
                label: String(row?.mandi || `Mandi ${index + 1}`),
                value: modal,
                trend: trendFromDelta(delta),
                delta,
            };
        });

        return {
            trendRows: toLiveTrendRows(
                selectedMandi,
                selectedModal || 2500,
                query.language,
                `${query.crop}:${query.state}:${selectedMandi}:${query.refreshKey}`
            ),
            nearbyCards,
            district: String(selectedRow?.district || district),
            updatedAt: String(payload?.price_date || new Date().toISOString()),
        };
    },
};

export const createMarketPricesAdapter = (): MarketPricesAdapter => {
    if (getDataMode() === 'live') return liveAdapter;
    return mockAdapter;
};
