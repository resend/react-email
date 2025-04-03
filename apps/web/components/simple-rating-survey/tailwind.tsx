import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
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
    <Preview>
      How satisfied were you overall with the initial conversation about your
      claim?
    </Preview>
    <Body>
      <Container className="mx-auto max-w-[600px] rounded-lg bg-white px-[42px] py-[24px]">
        <Heading className="mb-4 text-2xl leading-8">
          How satisfied were you overall with the initial conversation about
          your claim?
        </Heading>
        <Text className="mb-[42px] text-gray-500 text-sm leading-6">
          Your feedback is important to us and it will be used to better serve
          our customers.
        </Text>
        <Section className="max-w-[300px]">
          <Row>
            <Column className="w-[100px] text-center">
              <Text className="ml-3 text-left text-[#444444] text-xs leading-none">
                Dissatisfied
              </Text>
            </Column>
            <Column className="w-[100px] text-center">
              <Text className="mr-3 text-right text-[#444444] text-xs leading-none">
                Satisfied
              </Text>
            </Column>
          </Row>
        </Section>
        <Section className="mt-[12px] mb-[24px]">
          <Row className="w-full max-w-[300px] table-fixed border-separate border-spacing-[12px]">
            {Array.from({ length: 5 }).map((_, i) => (
              <Column key={i} className="rounded-md bg-indigo-600">
                <Button
                  href={`?rating=${i + 1}`}
                  className="flex w-full items-center justify-center p-3 text-center font-semibold text-base text-white leading-none"
                >
                  {i + 1}
                </Button>
              </Column>
            ))}
          </Row>
        </Section>
        <Section>
          <Hr />
          <Text className="mt-[30px] text-center font-medium text-gray-500 text-xs">
            Customer Experience Research Team
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default () => {
  return <Layout>{component}</Layout>;
};
