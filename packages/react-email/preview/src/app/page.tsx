import Home from './home';
import { getEmails } from '../utils/get-emails';

export default async function Index() {
  const { emails } = await getEmails();
  return <Home navItems={emails} />;
}

export const metadata = {
  title: 'React Email',
};
