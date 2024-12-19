import type { SendEmailCommandInput } from '@aws-sdk/client-ses';
import { SES } from '@aws-sdk/client-ses';
import { render } from '@react-email/components';
import { Email } from './email';

const ses = new SES({ region: process.env.AWS_SES_REGION });

const emailHtml = await render(<Email url="https://example.com" />);

const params: SendEmailCommandInput = {
  Source: 'you@example.com',
  Destination: {
    ToAddresses: ['user@gmail.com'],
  },
  Message: {
    Body: {
      Html: {
        Charset: 'UTF-8',
        Data: emailHtml,
      },
    },
    Subject: {
      Charset: 'UTF-8',
      Data: 'hello world',
    },
  },
};

await ses.sendEmail(params);
