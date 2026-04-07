import { useCallback, useSyncExternalStore } from 'react';

type Tab = 'preview' | 'source';

function getTab(): Tab {
  const params = new URLSearchParams(window.location.search);
  const value = params.get('tab');
  return value === 'source' ? 'source' : 'preview';
}

function subscribe(callback: () => void) {
  window.addEventListener('popstate', callback);
  return () => window.removeEventListener('popstate', callback);
}

export function useTabParam(): [Tab, (tab: Tab) => void] {
  const tab = useSyncExternalStore(subscribe, getTab, () => 'preview' as Tab);

  const setTab = useCallback((next: Tab) => {
    const url = new URL(window.location.href);
    if (next === 'preview') {
      url.searchParams.delete('tab');
    } else {
      url.searchParams.set('tab', next);
    }
    window.history.pushState(null, '', url);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }, []);

  return [tab, setTab];
}
