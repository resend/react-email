import { Body, Container, Head, Html, Tailwind } from '@react-email/components';
import { HeaderWithSocialIcons } from '../src/components/patterns/headers/with-social-icons';
import { HeaderWithCenteredMenu } from '../src/components/patterns/headers/with-centered-menu';
import { HeaderWithMenu } from '../src/components/patterns/headers/with-menu';

const Headers = () => {
  return <Html>
    <Head/>

    <Tailwind>
      <Body>
        <Container>
          <HeaderWithSocialIcons/>
          <HeaderWithCenteredMenu/>
          <HeaderWithMenu/>
        </Container>
      </Body>
    </Tailwind>
  </Html>;
}

export default Headers;
