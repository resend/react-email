import { pixelBasedPreset, Tailwind } from '@react-email/components';

export default function EmailTemplate() {
  const tailwindConfig = {
    theme: {},
    presets: [pixelBasedPreset],
  };
  return (
    <Tailwind config={tailwindConfig}>
      <div className="bg-red-400 w-20" />
    </Tailwind>
  );
}
