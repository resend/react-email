import type { Options } from './options';

const opts: Record<string, Options> = {};
let unsafeOpts: Options | undefined;

export function setRenderingOptions(
  uniqueRenderId: string | undefined,
  options: Options | undefined,
) {
  if (uniqueRenderId) {
    if (opts[uniqueRenderId])
      throw new Error('The uniqueRenderId provided is already in use.', {
        cause: {
          uniqueRenderId,
          options,
        },
      });

    opts[uniqueRenderId] = options ?? ({} as Options);
  } else {
    unsafeOpts = options ?? ({} as Options);
  }
}

function invariant<T>(value: T | undefined | null, message: string): T {
  if (value) {
    return value;
  }

  throw new Error(message);
}

export function unsetRenderingOptions(uniqueRenderId: string | undefined) {
  if (uniqueRenderId) delete opts[uniqueRenderId];
  else unsafeOpts = undefined;
}

export function useRenderingOptions(uniqueRenderId?: string) {
  if (uniqueRenderId)
    return invariant(
      opts[uniqueRenderId],
      "Can't call to `useRenderingOptions` without being inside React Email `render` call.",
    );

  return invariant(
    unsafeOpts,
    "Can't call to `useRenderingOptions` without being inside React Email `render` call.",
  );
}
