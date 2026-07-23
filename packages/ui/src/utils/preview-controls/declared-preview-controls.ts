import { z } from 'zod';
import { err, ok, type Result } from '../result';

// The vocabulary of controls a template can declare for its preview props
// through a static `PreviewControls` property, mirroring how `PreviewProps`
// is declared:
//
//   MyEmail.PreviewControls = {
//     username: { type: 'text', label: 'Username' },
//     plan: { type: 'select', options: ['hobby', 'pro', 'enterprise'] },
//     teamSize: { type: 'number', min: 1, max: 500 },
//   };
//
// Objects are strict so a typo'd field fails validation loudly instead of
// being silently ignored.
const declaredPreviewControlSchema = z.discriminatedUnion('type', [
  z.strictObject({
    type: z.literal('text'),
    label: z.string().optional(),
  }),
  z.strictObject({
    type: z.literal('number'),
    label: z.string().optional(),
    min: z.number().optional(),
    max: z.number().optional(),
    step: z.number().positive().optional(),
  }),
  z.strictObject({
    type: z.literal('boolean'),
    label: z.string().optional(),
  }),
  z.strictObject({
    type: z.literal('select'),
    label: z.string().optional(),
    options: z.array(z.union([z.string(), z.number()])).min(1),
  }),
  z.strictObject({
    type: z.literal('json'),
    label: z.string().optional(),
  }),
]);

const declaredPreviewControlsSchema = z.record(
  z.string(),
  declaredPreviewControlSchema,
);

export type DeclaredPreviewControl = z.infer<
  typeof declaredPreviewControlSchema
>;

export type DeclaredPreviewControls = z.infer<
  typeof declaredPreviewControlsSchema
>;

/**
 * Validates a template's `PreviewControls` export. A missing declaration is
 * fine (`ok(undefined)` — every control falls back to inference); an invalid
 * one errors with a human-readable message so the whole declaration can be
 * rejected predictably rather than partially applied.
 */
export const validatePreviewControlsDeclaration = (
  declaration: unknown,
): Result<DeclaredPreviewControls | undefined, string> => {
  if (declaration === undefined) {
    return ok(undefined);
  }

  const parsed = declaredPreviewControlsSchema.safeParse(declaration);
  if (!parsed.success) {
    return err(z.prettifyError(parsed.error));
  }

  return ok(parsed.data);
};
