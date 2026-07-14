'use client';

import { useEffect, useRef } from 'react';
import { io, type Socket } from 'socket.io-client';
import type { HotReloadChange } from '../utils/types/hot-reload-change';

/**
 * Hook that detects any "reload" event sent from the CLI's web socket
 * and calls the received parameter callback
 */
export const useHotreload = (
  onShouldReload: (changes: HotReloadChange[]) => void,
) => {
  const onShouldReloadRef = useRef(onShouldReload);
  onShouldReloadRef.current = onShouldReload;

  useEffect(() => {
    const socket: Socket = io();

    const handleReload = (changes: HotReloadChange[]) => {
      console.debug('Reloading...');
      void onShouldReloadRef.current(changes);
    };

    socket.on('reload', handleReload);

    return () => {
      socket.off('reload', handleReload);
      socket.disconnect();
    };
  }, []);
};
