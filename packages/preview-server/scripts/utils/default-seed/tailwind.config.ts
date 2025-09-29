import {
  createTailwind,
  pixelBasedPreset,
  type TailwindConfig,
} from '@react-email/components';

const config = {
  presets: [pixelBasedPreset],
} satisfies TailwindConfig;

export const Tailwind = await createTailwind(config);

export default config;
