import { render } from 'react-email';
import { VercelInviteUserEmail } from '../../emails/vercel-invite-user';

export default async function Home() {
  const emailHtml = await render(<VercelInviteUserEmail />);

  return <div dangerouslySetInnerHTML={{ __html: emailHtml }} />;
}
