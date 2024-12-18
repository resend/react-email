import { Link } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = <Link href="https://react.email">React Email</Link>;

export default () => {
  return <Layout>{component}</Layout>;
};
