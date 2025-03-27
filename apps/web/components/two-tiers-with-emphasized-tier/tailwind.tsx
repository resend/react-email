import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Html>
    <Head />
    <Preview>Choose the right plan for you</Preview>
    <Body>
      <Container className="bg-white rounded-lg mx-auto max-w-[600px] p-6">
        <Section className="mb-[42px]">
          <Heading className="text-2xl leading-8 mb-3 text-center">
            Choose the right plan for you
          </Heading>
          <Text className="text-gray-500 text-sm leading-5 mx-auto max-w-[500px] text-center">
            Choose an affordable plan with top features to engage audiences,
            build loyalty, and boost sales.
          </Text>
        </Section>
        <Section className="flex items-start gap-5 justify-center pb-6">
          {[
            {
              title: 'Hobby',
              price: 29,
              highlighted: false,
              description: 'The perfect plan to getting started.',
              features: [
                '25 products',
                'Up to 10,000 subscribers',
                'Advanced analytics',
                '24-hour support response time',
              ],
              buttonText: 'Get started today',
              buttonUrl: '#',
            },
            {
              title: 'Enterprise',
              price: 99,
              highlighted: true,
              description: 'Dedicated support and enterprise ready.',
              features: [
                'Unlimited products',
                'Unlimited subscribers',
                'Advanced analytics',
                'Dedicated support representative',
                'Marketing automations',
                'Custom integrations',
              ],
              buttonText: 'Get started today',
              buttonUrl: '#',
            },
          ].map((plan) => (
            <Section
              key={plan.title}
              className={`${
                plan.highlighted
                  ? 'bg-[#101828] border-[#101828] text-gray-300 mb-3'
                  : 'bg-white border-gray-300 text-gray-600 mb-6'
              } rounded-lg border border-solid p-6 text-left w-full`}
            >
              <Text
                className={`${
                  plan.highlighted ? 'text-[#7c86ff]' : 'text-[#4f46e5]'
                } text-sm font-semibold leading-5 mb-4`}
              >
                {plan.title}
              </Text>
              <Text className="text-[28px] font-bold mb-2 mt-0">
                <span
                  className={`${
                    plan.highlighted ? 'text-white' : 'text-[#101828]'
                  }`}
                >
                  ${plan.price}
                </span>{' '}
                <span className="text-sm leading-5">/ month</span>
              </Text>
              <Text className="mt-3 mb-6">{plan.description}</Text>
              <ul className="text-xs leading-5 mb-[30px] pl-[14px]">
                {plan.features.map((feature) => (
                  <li key={feature} className="mb-2">
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                href={plan.buttonUrl}
                className="bg-indigo-600 rounded-lg box-border text-white inline-block font-semibold m-0 max-w-full p-3 text-center w-full"
              >
                {plan.buttonText}
              </Button>
            </Section>
          ))}
        </Section>
        <Hr className="mt-0" />
        <Text className="text-gray-500 text-xs font-medium mt-[30px] text-center">
          Customer Experience Research Team
        </Text>
      </Container>
    </Body>
  </Html>
);

export default () => {
  return <Layout>{component}</Layout>;
};
