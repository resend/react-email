import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Html>
    <Head />
    <Preview>Top 5 Features of Our Service</Preview>
    <Body>
      <Container className="mx-auto max-w-[600px] rounded-[8px] bg-white p-[24px]">
        <Heading className="mb-[42px] text-center text-[24px] leading-[32px]">
          Top 5 Features of Our Service
        </Heading>
        {[
          {
            number: 1,
            title: 'Innovative Solutions',
            description:
              'We deliver innovative solutions that drive success and growth.',
          },
          {
            number: 2,
            title: 'Exceptional Performance',
            description:
              'Our services deliver high-quality performance and efficiency.',
          },
          {
            number: 3,
            title: 'Reliable Support',
            description:
              'We have robust support to keep your operations running smoothly.',
          },
          {
            number: 4,
            title: 'Advanced Security',
            description:
              'We implement cutting-edge security measures to protect your data and assets.',
          },
          {
            number: 5,
            title: 'Scalable Growth',
            description:
              'We develop customized strategies for sustainable and scalable growth.',
          },
        ].map((feature) => (
          <Section className="mb-[36px]">
            <Row className="pr-[32px] pl-[12px]">
              <Column
                width="24"
                height="24"
                align="center"
                valign="top"
                className="pr-[18px] h-[24px] w-[24px]"
              >
                <Row>
                  <Column
                    align="center"
                    valign="middle"
                    width="24"
                    height="24"
                    className="h-[24px] w-[24px] rounded-full bg-indigo-600 font-semibold text-white text-[12px] leading-none"
                  >
                    {feature.number}
                  </Column>
                </Row>
              </Column>
              <Column valign="top">
                <Heading
                  as="h2"
                  className="mt-[0px] mb-[8px] text-gray-900 text-[18px] leading-[28px]"
                >
                  {feature.title}
                </Heading>
                <Text className="m-0 text-gray-500 text-[14px] leading-[24px]">
                  {feature.description}
                </Text>
              </Column>
            </Row>
          </Section>
        ))}
      </Container>
    </Body>
  </Html>
);

export default () => {
  return <Layout>{component}</Layout>;
};
