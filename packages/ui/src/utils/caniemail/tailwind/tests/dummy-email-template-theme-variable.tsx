import { Tailwind } from 'react-email';

const customTheme = `
  @theme {
    --color-brand: #00ff00;
  }
`;

export default function EmailTemplate() {
  return (
    <Tailwind theme={customTheme}>
      <div className="bg-brand" />
    </Tailwind>
  );
}
