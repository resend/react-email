import { pixelBasedPreset, type TailwindConfig } from '@react-email/components';

export default {
  presets: [pixelBasedPreset],
  theme: {
    fontFamily: {
      amazon: ['Ember', 'Helvetica', 'Arial', 'sans-serif'],
      twitch: ['HelveticaNeue', 'Helvetica', 'Arial', 'sans-serif'],
    },
  },
} satisfies TailwindConfig;
