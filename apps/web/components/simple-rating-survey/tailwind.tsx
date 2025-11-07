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
      <Container className="mx-auto max-w-[600px] rounded-[8px] bg-white px-[42px] py-[24px]">
        <Heading className="mb-[16px] text-[24px] leading-[32px]">
          How satisfied were you overall with the initial conversation about
          your claim?
        </Heading>
        <Text className="mb-[42px] text-gray-500 text-[14px] leading-[24px]">
          Your feedback is important to us and it will be used to better serve
          our customers.
        </Text>
        <Section className="max-w-[300px]">
          <Row>
            <Column className="w-[100px] text-center">
              <Text className="ml-[12px] text-left text-[rgb(68,68,68)] text-[12px] leading-none">
                Dissatisfied
              </Text>
            </Column>
            <Column className="w-[100px] text-center">
              <Text className="mr-[12px] text-right text-[rgb(68,68,68)] text-[12px] leading-none">
                Satisfied
              </Text>
            </Column>
          </Row>
        </Section>
        <Section className="mt-[12px] mb-[24px]" align="center">
          <Row width={undefined}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Column
                key={i}
                width="51"
                height="43"
                className="w-[51px] h-[43px] px-[4px]"
                align="center"
                valign="middle"
              >
                <Button
                  href={`?rating=${i + 1}`}
                  className="box-border w-[43px] h-[43px] rounded-[6px] bg-indigo-600 p-[12px] m-0 text-center font-semibold text-[16px] text-white leading-none"
                >
                  {i + 1}
                </Button>
              </Column>
            ))}
          </Row>
        </Section>
        <Section>
          <Hr />
          <Text className="mt-[30px] text-center font-medium text-gray-500 text-[12px] leading-[16px]">
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
