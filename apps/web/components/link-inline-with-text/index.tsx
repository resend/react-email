import { Link, Text } from 'react-email';
import { Layout } from '../_components/layout';

export const component = (
  <Text>
    This is <Link href="https://react.email">React Email</Link>
  </Text>
);

export default () => {
  return <Layout>{component}</Layout>;
};
