import type { HotReloadEvent } from './hot-reload-event';

export interface HotReloadChange {
  filename: string;
  event: HotReloadEvent;
}
