import { pixelBasedPreset, type TailwindConfig } from '@react-email/components';

export default {
  presets: [pixelBasedPreset],
  theme: {
    fontFamily: {
      stripe: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Ubuntu',
        'sans-serif',
      ],
    },
  },
} satisfies TailwindConfig;
