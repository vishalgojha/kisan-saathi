const toBool = (value, fallback = false) => {
  if (value == null || value === '') return fallback;
  const normalized = String(value).toLowerCase();
  if (['1', 'true', 'yes'].includes(normalized)) return true;
  if (['0', 'false', 'no'].includes(normalized)) return false;
  return fallback;
};

const modeRaw = String(process.env.VITE_DATA_MODE || '').toLowerCase();
const nodeEnv = String(process.env.NODE_ENV || '').toLowerCase();
const isProd = nodeEnv === 'production' || toBool(process.env.CI_PRODUCTION, false);
const dataMode = modeRaw === 'live' ? 'live' : modeRaw === 'mock' ? 'mock' : isProd ? 'live' : 'mock';
const allowMockFallback =
  process.env.VITE_ALLOW_MOCK_FALLBACK == null
    ? !isProd || dataMode === 'mock'
    : toBool(process.env.VITE_ALLOW_MOCK_FALLBACK, true);

const issues = [];

if (!process.env.VITE_APP_ID) {
  issues.push('VITE_APP_ID is missing.');
}

if (!process.env.VITE_WHATSAPP_NUMBER) {
  issues.push('VITE_WHATSAPP_NUMBER is missing.');
}

if (isProd && dataMode === 'live' && !process.env.VITE_API_BASE_URL) {
  issues.push('VITE_API_BASE_URL is required in production when VITE_DATA_MODE=live.');
}

if (isProd && dataMode === 'live' && allowMockFallback) {
  issues.push('VITE_ALLOW_MOCK_FALLBACK must be false in production live mode.');
}

if (isProd && !process.env.VITE_MONITORING_ENDPOINT) {
  issues.push('VITE_MONITORING_ENDPOINT is required in production.');
}

if (issues.length > 0) {
  console.error('\nEnvironment validation failed:\n');
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

console.log('Environment validation passed.');
