import plunkImport from '@plunk/node';
import { render } from '@react-email/components';
import { Email } from './email';

const Plunk = (
  plunkImport as unknown as {
    default: typeof plunkImport;
  }
).default;

// See https://github.com/useplunk/node/issues/2 for why Plunk.default
const plunk = new Plunk(process.env.PLUNK_API_KEY || '');

const emailHtml = await render(<Email url="https://example.com" />);

await plunk.emails.send({
  to: 'hello@useplunk.com',
  subject: 'Hello world',
  body: emailHtml,
});
