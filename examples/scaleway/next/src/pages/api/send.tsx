import { render } from '@react-email/components';
import type { NextApiRequest, NextApiResponse } from 'next';
import { WaitlistEmail } from '../../../transactional/emails/waitlist';
import { scalewayTEM } from '../../lib/scaleway';

const send = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  await scalewayTEM.createEmail({
    from: {
      email: 'you@example.com',
      name: 'You',
    },
    to: [
      {
        email: 'user@gmail.com',
        name: 'User',
      },
    ],
    subject: 'Waitlist',
    html: await render(<WaitlistEmail name="User" />),
    text: '',
  });

  res.status(200).send({ data: 'Email sent successfully' });
};

export default send;
