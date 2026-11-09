import { pixelBasedPreset, Tailwind } from 'react-email';
// @ts-expect-error: only loadable through the user's `--esbuild-plugins`.
import greeting from './greeting.custom';

const config = {
  theme: {},
  presets: [pixelBasedPreset],
};

const customTheme = `
  @theme {
    --color-brand: #00ff00;
  }
`;

export default function EmailTemplate() {
  return (
    <Tailwind config={config} theme={customTheme}>
      <div className="bg-brand w-20">{greeting}</div>
    </Tailwind>
  );
}
