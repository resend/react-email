import { renderAsync } from '@react-email/components';
import { VercelInviteUserEmail } from '../../emails/vercel-invite-user';

export default async function Home() {
  const emailHtml = await renderAsync(<VercelInviteUserEmail />);
  return <div dangerouslySetInnerHTML={{ __html: emailHtml }} />;
}
