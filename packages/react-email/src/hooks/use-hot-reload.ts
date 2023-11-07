'use client';
import { useEffect, useRef } from 'react';
import { type Socket, io } from 'socket.io-client';
import type { HotReloadChange } from '../utils/types/hot-reload-change';

/**
 * Hook that detects any "reload" event sent from the CLI's web socket
 * and calls the received parameter callback
 */
export const useHotreload = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onShouldReload: (changes: HotReloadChange[]) => any,
) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      return;
    }

    if (!socketRef.current) {
      socketRef.current = io();
    }
    const socket = socketRef.current;

    socket.on('reload', (changes: HotReloadChange[]) => {
      console.debug('Reloading...');
      void onShouldReload(changes);
    });

    return () => {
      socket.off();
    };
  }, [onShouldReload]);
};
