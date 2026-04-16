import { Text } from 'react-email';
import { Layout } from '../_components/layout';

export const component = <Text>A simple paragraph</Text>;

export default () => {
  return <Layout>{component}</Layout>;
};
