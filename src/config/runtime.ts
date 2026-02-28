export type RuntimeConfig = {
    appId: string;
    apiBaseUrl: string;
    whatsappNumber: string;
    uploadEndpoint: string;
    dataMode: 'mock' | 'live';
    allowMockFallback: boolean;
    isProd: boolean;
};

const normalizeMode = (value: string | undefined): 'mock' | 'live' => {
    if ((value || '').toLowerCase() === 'live') return 'live';
    return 'mock';
};

const normalizeFallback = (value: string | undefined, defaultsTo: boolean): boolean => {
    if (value == null || value === '') return defaultsTo;
    const normalized = value.toLowerCase();
    if (normalized === '1' || normalized === 'true' || normalized === 'yes') return true;
    if (normalized === '0' || normalized === 'false' || normalized === 'no') return false;
    return defaultsTo;
};

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

const isProd = Boolean(import.meta.env.PROD);

const envMode = normalizeMode(import.meta.env.VITE_DATA_MODE as string | undefined);
const dataMode: 'mock' | 'live' = import.meta.env.VITE_DATA_MODE ? envMode : isProd ? 'live' : 'mock';

const allowMockFallbackDefault = !isProd || dataMode === 'mock';
const allowMockFallback = normalizeFallback(
    import.meta.env.VITE_ALLOW_MOCK_FALLBACK as string | undefined,
    allowMockFallbackDefault
);

export const runtimeConfig: RuntimeConfig = {
    appId: String(import.meta.env.VITE_APP_ID || '').trim(),
    apiBaseUrl: trimTrailingSlash(String(import.meta.env.VITE_API_BASE_URL || '').trim()),
    whatsappNumber: String(import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210').trim(),
    uploadEndpoint: String(import.meta.env.VITE_UPLOAD_ENDPOINT || '').trim(),
    dataMode,
    allowMockFallback,
    isProd,
};

export const getRuntimeWarnings = (): string[] => {
    const warnings: string[] = [];
    if (runtimeConfig.isProd && runtimeConfig.dataMode === 'live' && !runtimeConfig.apiBaseUrl) {
        warnings.push('VITE_API_BASE_URL is empty while running in production live mode.');
    }
    if (!runtimeConfig.appId) {
        warnings.push('VITE_APP_ID is missing. Configure it before production launch.');
    }
    if (!runtimeConfig.whatsappNumber) {
        warnings.push('VITE_WHATSAPP_NUMBER is missing.');
    }
    return warnings;
};
