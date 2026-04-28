import { Heading } from 'react-email';
import { Layout } from '../_components/layout';

export const component = (
  <Heading style={{ textAlign: 'center' }}>Ray Tomlinson</Heading>
);

export default () => {
  return <Layout>{component}</Layout>;
};
