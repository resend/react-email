import { Text } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = <Text>A simple paragraph</Text>;

export default () => {
  return <Layout>{component}</Layout>;
};
