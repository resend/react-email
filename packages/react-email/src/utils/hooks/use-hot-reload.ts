'use client';
import { useEffect, useRef } from 'react';
import { type Socket, io } from 'socket.io-client';
import type { HotReloadChange } from '../types/hot-reload-change';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useHotreload = (
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
