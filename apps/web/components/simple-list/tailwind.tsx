import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { Layout } from '../_components/layout';

const features = [
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
];

const FeatureSection = ({ number, title, description }) => (
  <Section className="mb-9">
    <div className="mr-8 ml-3 inline-flex items-start">
      <div className="mr-[18px] flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white text-xs leading-none">
        {number}
      </div>
      <div>
        <Heading as="h2" className="mt-0 mb-2 text-gray-900 text-lg">
          {title}
        </Heading>
        <Text className="m-0 text-gray-500 text-sm leading-5">
          {description}
        </Text>
      </div>
    </div>
  </Section>
);

export const component = (
  <Html>
    <Head />
    <Preview>Top 5 Features of Our Service</Preview>
    <Body className="m-0 bg-white p-6">
      <Container className="mx-auto max-w-[600px] rounded-lg bg-white p-6">
        <Heading className="mb-[42px] text-center text-2xl leading-8">
          Top 5 Features of Our Service
        </Heading>
        {features.map((feature) => (
          <FeatureSection
            key={feature.number}
            number={feature.number}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </Container>
    </Body>
  </Html>
);

export default () => {
  return <Layout>{component}</Layout>;
};
