import { pixelBasedPreset, type TailwindConfig } from '@react-email/components';

export default {
  presets: [pixelBasedPreset],
  theme: {
    fontFamily: {
      twitch: ['HelveticaNeue', 'Helvetica', 'Arial', 'sans-serif'],
    },
  },
} satisfies TailwindConfig;
