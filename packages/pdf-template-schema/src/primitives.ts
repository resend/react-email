import { z } from 'zod';

export const NonEmptyStringSchema = z.string().trim().min(1);

export const IdentifierSchema = NonEmptyStringSchema.regex(
  /^[A-Za-z0-9][A-Za-z0-9._:-]*$/,
  'Expected a stable identifier.',
);

export const VariableKeySchema = NonEmptyStringSchema.regex(
  /^[a-z][a-z0-9]*(?:[._][a-z0-9]+)*$/,
  'Expected a lower-case dotted variable key.',
);

export const DataPathSchema = NonEmptyStringSchema.regex(
  /^[a-zA-Z0-9_$]+(?:\.[a-zA-Z0-9_$]+)*$/,
  'Expected a dotted data path.',
);

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue =
  | JsonPrimitive
  | readonly JsonValue[]
  | { readonly [key: string]: JsonValue };

export const JsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number().finite(),
    z.boolean(),
    z.null(),
    z.array(JsonValueSchema),
    z.record(z.string(), JsonValueSchema),
  ]),
);

export const JsonObjectSchema = z.record(z.string(), JsonValueSchema);

export const IsoDateTimeSchema = z.string().datetime({ offset: true });

export const PositiveIntegerSchema = z.number().int().positive();

export const NonNegativeIntegerSchema = z.number().int().nonnegative();

export const NonNegativeNumberSchema = z.number().finite().nonnegative();

export const UrlSchema = z.string().url();

export const UnitLengthSchema = NonEmptyStringSchema.regex(
  /^\d+(?:\.\d+)?(?:in|cm|mm|pt|px)$/,
  'Expected a CSS length using in, cm, mm, pt, or px.',
);
