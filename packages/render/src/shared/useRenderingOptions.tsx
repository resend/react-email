import { createContext, useContext } from "react";
import { Options } from "./options";

export const OptionsContext = createContext<Options>({});

export function useRenderingOptions() {
  const opts = useContext(OptionsContext);
  return opts;
}
