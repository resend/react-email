import { Tailwind } from 'react-email';

export default function EmailTemplate() {
  const config = {};
  return (
    <Tailwind config={config}>
      <div className="bg-red-400 w-20" />
    </Tailwind>
  );
}
