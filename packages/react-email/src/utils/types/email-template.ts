import type { ZodObject, ZodType, ZodTypeDef } from 'zod';

export interface EmailTemplate {
  (props: Record<string, unknown> | Record<string, never>): React.ReactNode;
  PreviewProps?: Record<string, unknown>;
  PreviewSchema?: ZodObject<Record<string, ZodType<any, ZodTypeDef, any>>>;
}

export const isEmailTemplate = (val: unknown): val is EmailTemplate => {
  return typeof val === 'function';
};
