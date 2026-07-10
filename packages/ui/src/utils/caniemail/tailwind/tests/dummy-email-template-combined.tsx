import { Tailwind } from 'react-email';

const customTheme = '@theme { --color-brand: #00ff00; }';
const customUtility = '.badge { background: #fef3c7; }';
const config = { theme: { extend: { colors: { primary: '#ff0000' } } } };

export default function EmailTemplate() {
  return (
    <Tailwind config={config} theme={customTheme} utility={customUtility}>
      <div className="bg-brand bg-primary badge" />
    </Tailwind>
  );
}
