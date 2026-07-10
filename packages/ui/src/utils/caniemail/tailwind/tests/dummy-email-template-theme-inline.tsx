import { Tailwind } from 'react-email';

export default function EmailTemplate() {
  return (
    <Tailwind theme="@theme { --color-brand: #00ff00; }">
      <div className="bg-brand" />
    </Tailwind>
  );
}
