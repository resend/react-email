import { render } from '@react-email/render';
import { Tailwind as CurrentTailwind } from '@react-email/tailwind';
import EmailWithTailwind from './emails/with-tailwind.js';

await render(EmailWithTailwind({ Tailwind: CurrentTailwind }));
