import { Platform } from 'react-native';

export function registerServiceWorker() {
  if (Platform.OS !== 'web' || __DEV__ || typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
  const register = () => {
    navigator.serviceWorker.register('./sw.js', { scope: './' }).catch(() => {});
  };
  if (document.readyState === 'complete') register();
  else window.addEventListener('load', register, { once: true });
}
