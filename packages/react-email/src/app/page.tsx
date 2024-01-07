import { emailsDirectoryAbsolutePath } from '@/utils/emails-dir-path';
import { getEmailsDirectoryMetadata } from '../utils/actions/get-emails-directory-metadata';
import { Home } from './home';

const Index = async () => {
  const emailsDirMetadata = await getEmailsDirectoryMetadata();

  if (typeof emailsDirMetadata === 'undefined') {
    throw new Error(`Could not find the emails directory specified under ${emailsDirectoryAbsolutePath}!`);
  }

  return <Home emailsDirectoryMetadata={emailsDirMetadata} />;
};

export default Index;
