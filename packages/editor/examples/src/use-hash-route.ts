import { useSyncExternalStore } from 'react';

function getHash() {
  return window.location.hash.slice(1) || '';
}

function subscribe(callback: () => void) {
  window.addEventListener('hashchange', callback);
  return () => window.removeEventListener('hashchange', callback);
}

export function useHashRoute(
  defaultId: string,
): [string, (id: string) => void] {
  const hash = useSyncExternalStore(subscribe, getHash, () => '');
  const activeId = hash || defaultId;

  const setActiveId = (id: string) => {
    window.location.hash = id;
  };

  return [activeId, setActiveId];
}
