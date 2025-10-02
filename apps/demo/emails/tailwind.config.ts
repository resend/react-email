import { pixelBasedPreset, type TailwindConfig } from '@react-email/components';

export default {
  presets: [pixelBasedPreset],
  theme: {
    fontFamily: {
      codepen: '"Google Sans",Roboto,RobotoDraft,Helvetica,Arial,sans-serif',
    },
  },
} satisfies TailwindConfig;
