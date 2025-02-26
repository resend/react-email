import { Options } from "./options";

const opts: Record<string, Options> = {}

export function setRenderingOptions(uniqueRenderId: string | undefined, options: Options | undefined) {
  opts[uniqueRenderId ?? ""] = options ?? ({} as Options);
}

export function useRenderingOptions(uniqueRenderId?: string) {
  return opts[uniqueRenderId ?? ""];
}
