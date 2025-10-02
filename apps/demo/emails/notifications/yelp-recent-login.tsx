import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import tailwindConfig from '../tailwind.config';

interface YelpRecentLoginEmailProps {
  userFirstName?: string;
  loginDate?: Date;
  loginDevice?: string;
  loginLocation?: string;
  loginIp?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

export const YelpRecentLoginEmail = ({
  userFirstName,
  loginDate,
  loginDevice,
  loginLocation,
  loginIp,
}: YelpRecentLoginEmailProps) => {
  const formattedDate = new Intl.DateTimeFormat('en', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(loginDate);

  return (
    <Html>
      <Tailwind config={tailwindConfig}>
        <Head />
        <Body className="bg-white font-yelp">
          <Preview>Yelp recent login</Preview>
          <Container>
            <Section className="px-5 py-8">
              <Img src={`${baseUrl}/static/yelp-logo.png`} alt="Yelp logo" />
            </Section>

            <Section className="border border-black/10 rounded overflow-hidden">
              <Row>
                <Img
                  className="max-w-full"
                  width={620}
                  src={`${baseUrl}/static/yelp-header.png`}
                  alt="Yelp header illustration"
                />
              </Row>

              <Row className="p-5 pb-0">
                <Column>
                  <Heading className="text-3xl font-bold text-center">
                    Hi {userFirstName},
                  </Heading>
                  <Heading as="h2" className="text-2xl font-bold text-center">
                    We noticed a recent login to your Yelp account.
                  </Heading>

                  <Text className="text-base">
                    <b>Time: </b>
                    {formattedDate}
                  </Text>
                  <Text className="text-base -mt-1">
                    <b>Device: </b>
                    {loginDevice}
                  </Text>
                  <Text className="text-base -mt-1">
                    <b>Location: </b>
                    {loginLocation}
                  </Text>
                  <Text className="text-black/50 text-sm -mt-1">
                    *Approximate geographic location based on IP address:
                    {loginIp}
                  </Text>

                  <Text className="text-base">
                    If this was you, there's nothing else you need to do.
                  </Text>
                  <Text className="text-base -mt-1">
                    If this wasn't you or if you have additional questions,
                    please see our support page.
                  </Text>
                </Column>
              </Row>
              <Row className="p-5 pt-0">
                <Column className="text-center" colSpan={2}>
                  <Button className="bg-[#e00707] rounded border border-black/10 text-white font-bold cursor-pointer inline-block px-8 py-3 no-underline">
                    Learn More
                  </Button>
                </Column>
              </Row>
            </Section>

            <Section className="pt-11">
              <Img
                className="max-w-full"
                width={620}
                src={`${baseUrl}/static/yelp-footer.png`}
                alt="Yelp footer decoration"
              />
            </Section>

            <Text className="text-center text-xs text-black/70">
              © 2022 | Yelp Inc., 350 Mission Street, San Francisco, CA 94105,
              U.S.A. | www.yelp.com
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

YelpRecentLoginEmail.PreviewProps = {
  userFirstName: 'Alan',
  loginDate: new Date('September 7, 2022, 10:58 am'),
  loginDevice: 'Chrome on Mac OS X',
  loginLocation: 'Upland, California, United States',
  loginIp: '47.149.53.167',
} as YelpRecentLoginEmailProps;

export default YelpRecentLoginEmail;
