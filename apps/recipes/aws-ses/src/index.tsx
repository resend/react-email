import { SES } from '@aws-sdk/client-ses';
import { render } from '@react-email/render';
import * as React from 'react';
import { Email } from './email';

// eslint-disable-next-line turbo/no-undeclared-env-vars
const ses = new SES({ region: process.env.AWS_SES_REGION })

const emailHtml = render(<Email url="https://example.com" />);

const params = {
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

ses.sendEmail(params)

