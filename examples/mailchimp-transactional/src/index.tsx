import mailchimpTransactional from '@mailchimp/mailchimp_transactional';
import { render } from 'react-email';
import { Email } from './email';

const mailchimp = mailchimpTransactional(process.env.MAILCHIMP_API_KEY || '');

const emailHtml = await render(<Email url="https://example.com" />);

await mailchimp.messages.send({
  message: {
    subject: 'Hello world',
    from_email: 'hello@example.com',
    to: [{ email: 'hello@example.com', type: 'to' }],
    html: emailHtml,
  },
});
