import type { Controls } from '../../package';

export interface EmailTemplate {
  (props: Record<string, unknown> | Record<string, never>): React.ReactNode;
  controls?: Controls;
}

export const isEmailTemplate = (val: unknown): val is EmailTemplate => {
  return typeof val === 'function';
};
