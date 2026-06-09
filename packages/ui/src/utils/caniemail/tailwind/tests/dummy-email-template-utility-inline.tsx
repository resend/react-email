import { Tailwind } from 'react-email';

export default function EmailTemplate() {
  return (
    <Tailwind utility=".badge { background: #fef3c7; padding: 4px; }">
      <div className="badge" />
    </Tailwind>
  );
}
