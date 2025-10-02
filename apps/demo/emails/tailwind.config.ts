import { pixelBasedPreset, type TailwindConfig } from '@react-email/components';

export default {
  presets: [pixelBasedPreset],
  theme: {
    fontFamily: {
      'stack-overflow': 'HelveticaNeue,Helvetica,Arial,sans-serif',
      'stack-overflow-mono': 'Consolas,monospace',
    },
  },
} satisfies TailwindConfig;
