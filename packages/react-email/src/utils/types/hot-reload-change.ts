import type { HotReloadEvent } from './hot-reload-event.js';

export interface HotReloadChange {
  filename: string;
  event: HotReloadEvent;
}
