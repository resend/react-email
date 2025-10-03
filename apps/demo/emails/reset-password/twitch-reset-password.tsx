import {
  Body,
  Column,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import tailwindConfig from '../tailwind.config';

interface TwitchResetPasswordEmailProps {
  username?: string;
  updatedDate?: Date;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

export const TwitchResetPasswordEmail = ({
  username,
  updatedDate,
}: TwitchResetPasswordEmailProps) => {
  const formattedDate = new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'medium',
  }).format(updatedDate);

  return (
    <Html>
      <Head />
      <Tailwind config={tailwindConfig}>
        <Body className="bg-[#efeef1] font-twitch">
          <Preview>You updated the password for your Twitch account</Preview>
          <Container className="max-w-[580px] my-8 mx-auto bg-white">
            <Section className="p-8">
              <Img
                width={114}
                src={`${baseUrl}/static/twitch-logo.png`}
                alt="Twitch"
                className="mx-auto"
              />
            </Section>
            <Section className="w-full">
              <Row>
                <Column className="border-b border-solid border-[rgb(238,238,238)] w-[249px]" />
                <Column className="border-b border-solid border-[rgb(145,71,255)] w-[102px]" />
                <Column className="border-b border-solid border-[rgb(238,238,238)] w-[249px]" />
              </Row>
            </Section>
            <Section className="py-1.5 px-5 pb-2.5">
              <Text className="leading-6 text-sm">Hi {username},</Text>
              <Text className="leading-6 text-sm">
                You updated the password for your Twitch account on{' '}
                {formattedDate}. If this was you, then no further action is
                required.
              </Text>
              <Text className="leading-6 text-sm">
                However if you did NOT perform this password change, please{' '}
                <Link href="https://www.twitch.tv" className="underline">
                  reset your account password
                </Link>{' '}
                immediately.
              </Text>
              <Text className="leading-6 text-sm">
                Remember to use a password that is both strong and unique to
                your Twitch account. To learn more about how to create a strong
                and unique password,{' '}
                <Link href="https://www.twitch.tv" className="underline">
                  click here.
                </Link>
              </Text>
              <Text className="leading-6 text-sm">
                Still have questions? Please contact{' '}
                <Link href="https://www.twitch.tv" className="underline">
                  Twitch Support
                </Link>
              </Text>
              <Text className="leading-6 text-sm">
                Thanks,
                <br />
                Twitch Support Team
              </Text>
            </Section>
          </Container>

          <Section className="max-w-[580px] mx-auto">
            <Row>
              <Column align="right" className="w-1/2 pr-2">
                <Img
                  src={`${baseUrl}/static/twitch-icon-twitter.png`}
                  alt="Twitter"
                />
              </Column>
              <Column align="left" className="w-1/2 pl-2">
                <Img
                  src={`${baseUrl}/static/twitch-icon-facebook.png`}
                  alt="Facebook"
                />
              </Column>
            </Row>
            <Row>
              <Text className="text-center text-[#706a7b]">
                © 2022 Twitch, All Rights Reserved <br />
                350 Bush Street, 2nd Floor, San Francisco, CA, 94104 - USA
              </Text>
            </Row>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  );
};

TwitchResetPasswordEmail.PreviewProps = {
  username: 'alanturing',
  updatedDate: new Date('June 23, 2022 4:06:00 pm UTC'),
} as TwitchResetPasswordEmailProps;

TwitchResetPasswordEmail.tailwindConfig = tailwindConfig;

export default TwitchResetPasswordEmail;
