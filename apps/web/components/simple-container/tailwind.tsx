import { Container, Text } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Container className="bg-gray-400">
    <Text className="px-[12px] text-white">
      Hello, I am a container. I keep content centered and maintain it to a
      maximum width while still taking up as much space as possible!
    </Text>
  </Container>
);

export default () => {
  return <Layout>{component}</Layout>;
};
