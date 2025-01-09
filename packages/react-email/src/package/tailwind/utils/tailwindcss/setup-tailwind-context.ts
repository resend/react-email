import { createContext } from 'patched-tailwindcss/lib/lib/setupContextUtils';
import resolveConfig from 'patched-tailwindcss/resolveConfig';
import type { TailwindConfig } from '../../tailwind';

export const setupTailwindContext = (config: TailwindConfig) => {
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
