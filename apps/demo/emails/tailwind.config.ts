import {
  createTailwind,
  pixelBasedPreset,
  type TailwindConfig,
} from '@react-email/components';

const config = {
  presets: [pixelBasedPreset],
} satisfies TailwindConfig;

export const Tailwind = await createTailwind(config);

// This ensure that tailwind's VS Code extension works properly
export default config;
