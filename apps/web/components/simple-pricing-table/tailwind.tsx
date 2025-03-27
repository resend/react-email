import {
  Body,
  Button,
  Container,
  Head,
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
    <Preview>
      Exclusive Offer Just For You: Unlock Premium Features at $12/month
    </Preview>
    <Body>
      <Container className="bg-white rounded-xl mx-auto max-w-[500px] p-6">
        <Section className="bg-white border border-gray-300 rounded-xl text-gray-600 p-[28px] w-full">
          <Text className="text-indigo-600 text-xs font-semibold tracking-wide leading-5 mb-4 uppercase">
            Exclusive Offer
          </Text>
          <Text className="text-[30px] font-bold leading-[36px] mb-3">
            <span className="text-[#101828]">$12</span>{' '}
            <span className="text-[16px] font-medium leading-5">/ month</span>
          </Text>
          <Text className="text-gray-700 text-sm leading-5 mt-4 mb-6">
            We've handcrafted the perfect plan tailored specifically for your
            needs. Unlock premium features at an unbeatable value.
          </Text>
          <ul className="text-gray-500 text-sm leading-6 mb-8 pl-[14px]">
            {[
              'Manage up to 25 premium products',
              'Grow your audience with 10,000 subscribers',
              'Make data-driven decisions with advanced analytics',
              'Priority support with 24-hour response time',
              'Seamless integration with your favorite tools',
            ].map((feature) => (
              <li key={feature} className="mb-3 relative">
                <span className="relative">{feature}</span>
              </li>
            ))}
          </ul>
          <Button
            href="#"
            className="bg-indigo-600 rounded-lg box-border text-white inline-block text-base font-bold tracking-[0.025em] mb-6 max-w-full p-[14px] text-center w-full"
          >
            Claim Your Special Offer
          </Button>
          <Hr />
          <Text className="text-gray-500 text-xs italic mt-6 mb-[6px] text-center">
            Limited time offer - Upgrade now and save 20%
          </Text>
          <Text className="text-gray-500 text-xs text-center">
            No credit card required. 14-day free trial available.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default () => {
  return <Layout>{component}</Layout>;
};
