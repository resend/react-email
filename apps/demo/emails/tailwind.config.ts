import { pixelBasedPreset, type TailwindConfig } from '@react-email/components';

export default {
  presets: [pixelBasedPreset],
  theme: {
    fontFamily: {
      amazon: ['Ember', 'Helvetica', 'Arial', 'sans-serif'],
      stripe: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Ubuntu',
        'sans-serif',
      ],
      dropbox: [
        'Open Sans',
        'HelveticaNeue-Light',
        'Helvetica Neue Light',
        'Helvetica Neue',
        'Helvetica',
        'Arial',
        'Lucida Grande',
        'sans-serif',
      ],
      'dropbox-sans': ['Open Sans', 'Helvetica Neue', 'Arial'],
    },
  },
} satisfies TailwindConfig;
