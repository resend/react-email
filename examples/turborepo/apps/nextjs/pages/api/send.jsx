import VercelInviteUser from '../../react-email/emails/vercel-invite-user';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function send(req, res) {
  try {
    const data = await resend.sendEmail({
      from: "onboarding@resend.dev",
      to: "user@example.com",
      subject: "Join team on Vercel",
      react: <VercelInviteUser />,
    });

    res.status(200).json(data);
  }
  catch(e) {
    console.log(e);
    res.status(400).json(e);
  }
}
