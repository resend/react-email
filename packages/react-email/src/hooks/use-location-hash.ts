import { useEffect, useState, useSyncExternalStore } from 'react';

export const useLocationHash = () => {
  const [locationHash, setLocationHash] = useState(
    'location' in global ? global.location.hash : '',
  );

  useEffect(() => {
    const handler = () => {
      setLocationHash(global.location.hash);
    };

    window.addEventListener('hashchange', handler);
    return () => {
      window.removeEventListener('hashchange', handler);
    };
  }, []);

  return useSyncExternalStore(
    () => () => { },
    () => locationHash,
    () => undefined,
  );
};
