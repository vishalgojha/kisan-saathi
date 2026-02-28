import { runtimeConfig } from '@/config/runtime';

export type DataMode = 'mock' | 'live';

const DATA_MODE_STORAGE_KEY = 'kisan_saathi_data_mode';

const normalizeDataMode = (value: string | null | undefined): DataMode => {
    if ((value || '').toLowerCase() === 'live') return 'live';
    return 'mock';
};

const readStorageDataMode = (): string => {
    if (typeof window === 'undefined') return '';
    const raw = window.localStorage.getItem(DATA_MODE_STORAGE_KEY);
    if (!raw) return '';
    try {
        const parsed = JSON.parse(raw);
        return typeof parsed === 'string' ? parsed : raw;
    } catch {
        return raw;
    }
};

export const getDataMode = (): DataMode => {
    if (runtimeConfig.dataMode) return runtimeConfig.dataMode;
    return normalizeDataMode(readStorageDataMode());
};
