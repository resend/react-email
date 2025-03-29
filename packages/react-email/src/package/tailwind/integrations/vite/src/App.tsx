import { render } from 'react-email';
import { VercelInviteUserEmail } from '../emails/vercel-invite-user';
import { use } from 'react';

const emailHtmlPromise = render(<VercelInviteUserEmail />);

function App() {
  const emailHtml = use(emailHtmlPromise);
  console.log(emailHtml);
  return <div dangerouslySetInnerHTML={{ __html: emailHtml }} />;
}

export default App;
