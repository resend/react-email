import { render } from 'react-email';
import { VercelInviteUserEmail } from '../emails/vercel-invite-user';

const emailHtml = await render(<VercelInviteUserEmail />);

function App() {
  return <div dangerouslySetInnerHTML={{ __html: emailHtml }} />;
}

export default App;
