import type { NextApiRequest, NextApiResponse } from 'next';
import { WaitlistEmail } from '../../../transactional/emails/waitlist';
import { resend } from '../../lib/resend';

const send = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  switch (method) {
    case 'GET': {
      const data = await resend.emails.send({
        from: 'bu@resend.dev',
        to: 'delivered@resend.dev',
        subject: 'Waitlist',
        react: WaitlistEmail({ name: 'Bu' }),
      });

      res.status(200).send(data);
      break;
    }
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default send;
