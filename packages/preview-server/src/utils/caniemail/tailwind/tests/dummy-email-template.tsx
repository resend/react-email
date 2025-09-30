import { createTailwind } from '@react-email/components';
import tailwindConfig from './tailwind.config';

const Tailwind = await createTailwind(tailwindConfig);

export default function EmailTemplate() {
  return (
    <Tailwind>
      <div className="bg-red-400 w-20" />
    </Tailwind>
  );
}
