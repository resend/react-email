import { Heading } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Heading className="text-center">Ray Tomlinson</Heading>
);

export default () => {
  return <Layout>{component}</Layout>;
};
