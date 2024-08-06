import { createContext } from "tailwindcss/lib/lib/setupContextUtils";
import type {
  BlocklistConfig,
  CorePluginsConfig,
  CustomThemeConfig,
  DarkModeConfig,
  ExperimentalConfig,
  FutureConfig,
  ImportantConfig,
  PluginsConfig,
  PrefixConfig,
  PresetsConfig,
  SafelistConfig,
  SeparatorConfig,
} from "tailwindcss/types/config";
import resolveConfig from "tailwindcss/resolveConfig";

export type TailwindComponentConfig = Partial<{
  important: Partial<ImportantConfig>;
  prefix: Partial<PrefixConfig>;
  separator: Partial<SeparatorConfig>;
  safelist: SafelistConfig[];
  blocklist: BlocklistConfig[];
  presets: PresetsConfig[];
  future: Partial<FutureConfig>;
  experimental: Partial<ExperimentalConfig>;
  darkMode: Partial<DarkModeConfig>;
  theme: Partial<CustomThemeConfig & { extend: Partial<CustomThemeConfig> }>;
  corePlugins: Partial<CorePluginsConfig>;
  plugins: Partial<PluginsConfig>;
}>;

export const setupTailwindContext = (config: TailwindComponentConfig) => {
  return createContext(
    resolveConfig({
      ...config,
      content: [],
      corePlugins: {
        preflight: false,
      },
    }),
  );
};
