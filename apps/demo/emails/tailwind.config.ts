import { pixelBasedPreset, type TailwindConfig } from '@react-email/components';

export default {
  presets: [pixelBasedPreset],
  theme: {
    fontFamily: {
      amazon: ['Ember', 'Helvetica', 'Arial', 'sans-serif'],
      'stack-overflow': 'HelveticaNeue,Helvetica,Arial,sans-serif',
      'stack-overflow-mono': 'Consolas,monospace',
    },
  },
} satisfies TailwindConfig;
