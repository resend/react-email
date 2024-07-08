import { Body, Container, Head, Html, Tailwind } from '@react-email/components';
import { HeaderWithSocialIcons } from '../src/components/patterns/headers/with-social-icons';

const Headers = () => {
  return <Html>
    <Head/>

    <Tailwind>
      <Body>
        <Container>
          <HeaderWithSocialIcons/>
        </Container>
      </Body>
    </Tailwind>
  </Html>;
}

export default Headers;
