import {
  Button,
  Column,
  Heading,
  Row,
  Section,
  Text,
} from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Section className="py-[16px] text-center">
    <Text className="my-[8px] text-[18px] font-semibold leading-[28px] text-indigo-600">
      Your opinion matters
    </Text>
    <Heading
      as="h1"
      className="m-0 mt-[8px] text-[30px] font-semibold leading-[36px] text-gray-900"
    >
      We want to hear you
    </Heading>
    <Text className="text-[16px] leading-[24px] text-gray-700">
      How would you rate your experience using our product in a scale from 1 to
      5?
    </Text>
    <Row>
      <Column align="center">
        <table>
          <tr>
            {[1, 2, 3, 4, 5].map((number) => (
              <td align="center" className="p-[4px]" key={number}>
                <Button
                  className="h-[20px] w-[20px] rounded-[8px] border border-solid border-indigo-600 p-[8px] font-semibold text-indigo-600"
                  // Replace with the proper URL that saves the selected number
                  href="https://react.email"
                >
                  {number}
                </Button>
              </td>
            ))}
          </tr>
        </table>
      </Column>
    </Row>
  </Section>
);

export default () => {
  return <Layout>{component}</Layout>;
};
