import { Options } from "./options";

const opts: Record<string, Options> = {}
let unsafeOpts: Options | undefined;

export function setRenderingOptions(uniqueRenderId: string | undefined, options: Options | undefined) {
  if (uniqueRenderId) {
    if (opts[uniqueRenderId])
      throw new Error("@react-email/render error: The uniqueRenderId provided is already in use.")

    opts[uniqueRenderId] = options ?? ({} as Options);

  } else {
    unsafeOpts = options ?? ({} as Options);
  }
}

export function unsetRenderingOptions(uniqueRenderId: string | undefined) {
  if (uniqueRenderId) delete opts[uniqueRenderId];
  else unsafeOpts = undefined;
}

export function useRenderingOptions(uniqueRenderId?: string) {
  if (uniqueRenderId) return opts[uniqueRenderId];
  else return unsafeOpts;
}
