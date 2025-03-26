import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';
import { Layout } from '../_components/layout';

const steps = [
  {
    number: 1,
    imageUrl: '/static/stagg-eletric-kettle.jpg',
    title: 'Start Your Search',
    description:
      'Search for the products you need or upload your list of requirements.',
    learnMoreLink: 'https://your-site.com/learn-more/step1',
  },
  {
    number: 2,
    imageUrl: '/static/atmos-vacuum-canister.jpg',
    title: 'Compare & Save',
    description:
      'Compare prices and offers from different suppliers to find the best deals.',
    learnMoreLink: 'https://your-site.com/learn-more/step2',
  },
  {
    number: 3,
    imageUrl: '/static/bundle-collection.jpg',
    title: 'Build Your Cart',
    description:
      'Select your desired items and add them to your shopping cart.',
    learnMoreLink: 'https://your-site.com/learn-more/step3',
  },
  {
    number: 4,
    imageUrl: '/static/clara-french-press.jpg',
    title: 'Enjoy The Benefits',
    description:
      'Receive your products and enjoy the savings and convenience of our service.',
    learnMoreLink: 'https://your-site.com/learn-more/step5',
  },
];

const Step = ({ number, imageUrl, title, description, learnMoreLink }) => {
  return (
    <Section className="mb-8">
      <Row className="mb-6">
        <Column className="w-2/5 pr-6">
          <Img
            src={imageUrl}
            width="100%"
            height="168px"
            alt={`Step image - ${number}`}
            className="block w-full rounded object-cover object-center"
          />
        </Column>
        <Column className="w-3/5 pr-6">
          <div className="mb-4 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white text-xs leading-none">
            {number}
          </div>
          <Heading as="h2" className="mt-0 mb-2 font-bold text-xl leading-none">
            {title}
          </Heading>
          <Text className="m-0 text-gray-500 text-sm leading-6">
            {description}
          </Text>
          <Link
            href={learnMoreLink}
            className="mt-3 block font-semibold text-indigo-600 text-sm no-underline"
          >
            Learn more →
          </Link>
        </Column>
      </Row>
    </Section>
  );
};

export const component = (
  <Html>
    <Head />
    <Preview>How Our Service Works: 5 Simple Steps</Preview>
    <Body className="bg-white">
      <Container className="mx-auto max-w-[600px] rounded-lg bg-white px-6 pt-6 pb-0">
        <Heading as="h1" className="mb-[42px] text-center text-2xl leading-8">
          How Our Service Works: 5 Simple Steps
        </Heading>
        {steps.map((step) => (
          <Step
            key={step.number}
            number={step.number}
            imageUrl={step.imageUrl}
            title={step.title}
            description={step.description}
            learnMoreLink={step.learnMoreLink}
          />
        ))}
      </Container>
    </Body>
  </Html>
);

export default () => {
  return <Layout>{component}</Layout>;
};
