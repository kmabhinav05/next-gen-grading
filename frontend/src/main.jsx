import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';

// PWA Service Worker Registration
import { registerSW } from 'virtual:pwa-register';

// Auto-recover from stale deployment chunk hash changes
window.addEventListener('vite:preloadError', async (event) => {
  event.preventDefault();
  try {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const reg of registrations) await reg.unregister();
    }
    if ('caches' in window) {
      const names = await caches.keys();
      for (const name of names) await caches.delete(name);
    }
  } catch {}
  const targetUrl = new URL(window.location.href);
  targetUrl.searchParams.set('v', Date.now().toString());
  window.location.href = targetUrl.toString();
});

registerSW({
  immediate: true,
  onOfflineReady() {
    console.log('NextGenGrading is ready for offline usage');
  }
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute stale-while-revalidate
      cacheTime: 10 * 60 * 1000, // 10 minutes memory cache
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
