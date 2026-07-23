export interface EmailTemplate {
  (props: Record<string, unknown> | Record<string, never>): React.ReactNode;
  PreviewProps?: Record<string, unknown>;
  /**
   * Optional per-prop control metadata for the preview props panel; comes
   * from user code, so it is `unknown` until validated against the schema in
   * `utils/preview-controls`.
   */
  PreviewControls?: unknown;
}

export const isEmailTemplate = (val: unknown): val is EmailTemplate => {
  return typeof val === 'function';
};
