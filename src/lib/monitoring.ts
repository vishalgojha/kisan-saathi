import { runtimeConfig } from '@/config/runtime';

type MonitoringLevel = 'info' | 'warning' | 'error';

type MonitoringPayload = {
    level: MonitoringLevel;
    message: string;
    source: string;
    metadata?: Record<string, unknown>;
};

const sanitizeMetadata = (value: Record<string, unknown> = {}) => {
    const clean: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value)) {
        if (item == null) {
            clean[key] = item;
            continue;
        }
        if (typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean') {
            clean[key] = item;
            continue;
        }
        try {
            clean[key] = JSON.stringify(item);
        } catch {
            clean[key] = String(item);
        }
    }
    return clean;
};

const postToMonitoring = async (body: Record<string, unknown>) => {
    if (!runtimeConfig.monitoringEndpoint) return;
    const payload = JSON.stringify(body);
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    if (runtimeConfig.monitoringApiKey) {
        headers['x-monitoring-key'] = runtimeConfig.monitoringApiKey;
    }

    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
        try {
            const blob = new Blob([payload], { type: 'application/json' });
            const sent = navigator.sendBeacon(runtimeConfig.monitoringEndpoint, blob);
            if (sent) return;
        } catch {
            // Fallback to fetch below.
        }
    }

    await fetch(runtimeConfig.monitoringEndpoint, {
        method: 'POST',
        headers,
        body: payload,
        keepalive: true,
    });
};

export const reportMonitoringEvent = async (payload: MonitoringPayload) => {
    if (!runtimeConfig.monitoringEndpoint) return;

    const eventBody = {
        app_id: runtimeConfig.appId || 'unknown-app',
        release_version: runtimeConfig.releaseVersion || 'unversioned',
        data_mode: runtimeConfig.dataMode,
        environment: runtimeConfig.isProd ? 'production' : 'development',
        level: payload.level,
        message: payload.message,
        source: payload.source,
        url: typeof window !== 'undefined' ? window.location.href : '',
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        metadata: sanitizeMetadata(payload.metadata),
        timestamp: new Date().toISOString(),
    };

    try {
        await postToMonitoring(eventBody);
    } catch (error) {
        // Monitoring failures should never block app functionality.
        console.warn('[Monitoring] Failed to export event', error);
    }
};

const extractErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    try {
        return JSON.stringify(error);
    } catch {
        return String(error);
    }
};

export const reportRuntimeError = async (
    source: string,
    error: unknown,
    metadata: Record<string, unknown> = {}
) => {
    const message = extractErrorMessage(error);
    await reportMonitoringEvent({
        level: 'error',
        message,
        source,
        metadata,
    });
};
