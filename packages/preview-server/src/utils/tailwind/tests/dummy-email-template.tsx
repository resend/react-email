import { Tailwind } from '@react-email/components';
import tailwindConfig from './tailwind.config';

export default function EmailTemplate() {
  return (
    <Tailwind config={tailwindConfig}>
      <div className="bg-red-400 w-20" />
    </Tailwind>
  );
}
