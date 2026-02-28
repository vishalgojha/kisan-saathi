import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App'
import '@/index.css'
import { getRuntimeWarnings, runtimeConfig } from '@/config/runtime'

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>,
)

const runtimeWarnings = getRuntimeWarnings();
if (runtimeWarnings.length > 0) {
  for (const warning of runtimeWarnings) {
    // Runtime config warnings help catch production misconfiguration early.
    console.warn(`[RuntimeConfig] ${warning}`);
  }
}

if (runtimeConfig.isProd) {
  window.addEventListener('error', (event) => {
    console.error('[RuntimeError]', event.error || event.message);
  });
  window.addEventListener('unhandledrejection', (event) => {
    console.error('[UnhandledPromiseRejection]', event.reason);
  });
}

if (import.meta.hot) {
  import.meta.hot.on('vite:beforeUpdate', () => {
    window.parent?.postMessage({ type: 'sandbox:beforeUpdate' }, '*');
  });
  import.meta.hot.on('vite:afterUpdate', () => {
    window.parent?.postMessage({ type: 'sandbox:afterUpdate' }, '*');
  });
}



