import type { Config as TailwindOriginalConfig } from "tailwindcss";

export type TailwindConfig = Pick<
  TailwindOriginalConfig,
  | "important"
  | "prefix"
  | "separator"
  | "safelist"
  | "blocklist"
  | "presets"
  | "future"
  | "experimental"
  | "darkMode"
  | "theme"
  | "corePlugins"
  | "plugins"
>;
