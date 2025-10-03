import { pixelBasedPreset, type TailwindConfig } from '@react-email/components';

export default {
  presets: [pixelBasedPreset],
  theme: {
    fontFamily: {
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
    },
  },
} satisfies TailwindConfig;
