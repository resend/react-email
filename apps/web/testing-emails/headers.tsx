import { Body, Container, Head, Html, Tailwind } from '@react-email/components';
import { headerWithSocialIcons } from '../src/components/patterns/headers/with-social-icons';
import { headerWithCenteredMenu } from '../src/components/patterns/headers/with-centered-menu';
import { headerWithMenu } from '../src/components/patterns/headers/with-menu';

const Headers = () => {
  return <Html>
    <Head/>

    <Tailwind>
      <Body>
        <Container>
          {headerWithSocialIcons}
          {headerWithCenteredMenu}
          {headerWithMenu}
        </Container>
      </Body>
    </Tailwind>
  </Html>;
}

export default Headers;
