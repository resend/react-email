import { Container, Text } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Container style={{ backgroundColor: 'rgb(156,163,175)' }}>
    <Text
      style={{ color: 'rgb(255,255,255)', paddingLeft: 12, paddingRight: 12 }}
    >
      Hello, I am a container. I keep content centered and maintain it to a
      maximum width while still taking up as much space as possible!
    </Text>
  </Container>
);

export default () => {
  return <Layout>{component}</Layout>;
};
