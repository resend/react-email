import { pixelBasedPreset, Tailwind } from 'react-email';

const _config = { wrong: true };

export default function EmailTemplate() {
  const config = {
    theme: {},
    presets: [pixelBasedPreset],
  };
  return (
    <Tailwind config={config}>
      <div className="bg-red-400 w-20" />
    </Tailwind>
  );
}
