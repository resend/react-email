import { pixelBasedPreset, type TailwindConfig } from '@react-email/components';

export default {
  presets: [pixelBasedPreset],
  theme: {
    fontFamily: {
      amazon: ['Ember', 'Helvetica', 'Arial', 'sans-serif'],
      linear:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
    },
  },
} satisfies TailwindConfig;
