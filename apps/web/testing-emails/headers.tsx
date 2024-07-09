import { Body, Container, Head, Html, Tailwind } from '@react-email/components';
import { headerWithSocialIcons } from './patterns/headers/with-social-icons';
import { headerWithCenteredMenu } from './patterns/headers/with-centered-menu';
import { headerWithMenu } from './patterns/headers/with-menu';
import tailwindConfig from './tailwind.config';

const Headers = () => {
  return <Html>
    <Head/>

    <Tailwind config={tailwindConfig}>
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
