/* eslint-disable */
import { emailsDirPath, getEmailSlugs } from '../utils/get-email-slugs';
import { Home } from './home';

const Index = async () => {
  const emailSlugs = getEmailSlugs();

  return (
    <Home
      emailSlugs={emailSlugs}
    />
  );
};

export default Index;
