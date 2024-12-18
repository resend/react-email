import { Section, Text } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Section>
    <Text>Hello my section!</Text>
  </Section>
);

export default () => {
  return <Layout>{component}</Layout>;
};
