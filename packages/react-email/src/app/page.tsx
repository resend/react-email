/* eslint-disable */
import { getEmails } from '../utils/get-emails';
import { renderAsync } from '@react-email/render';
import { getEmailComponent } from '../utils/get-email-component';
import { EmailTemplate } from '../utils/types/email-template';

const Home = async () => {
  const emailPaths = getEmails();

  const emailTemplates = await getEmailComponent(...emailPaths);
  const FirstEmail = emailTemplates.values().next().value as EmailTemplate;
  const emailMarkup = await renderAsync(
    <FirstEmail {...FirstEmail.PreviewProps} />,
  );

  return <main dangerouslySetInnerHTML={{ __html: emailMarkup }} />;
};

export default Home;
