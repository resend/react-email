import {
  Button,
  Column,
  Heading,
  Row,
  Section,
  Text,
} from "@react-email/components";

export const title = "Survey";

export const survey = (
  /* start pattern code */
  <Section className="text-center py-4">
    <Text className="my-2 text-lg font-semibold text-indigo-600">
      Your opinion matters
    </Text>
    <Heading as="h1" className="m-0 mt-2 text-3xl font-semibold text-gray-900">
      We want to hear from you
    </Heading>
    <Text className="text-base text-gray-700">
      How would you rate your experience using our product in a scale from 1 to
      5?
    </Text>
    <Row>
      <Column align="center">
        <table>
          <tr>
            {[1, 2, 3, 4, 5].map((number) => (
              <td align="center" className="p-1" key={number}>
                <Button
                  className="h-5 w-5 rounded-lg border border-solid border-indigo-600 p-2 font-semibold text-indigo-600"
                  // Replace with the proper URL that saves the selected number
                  href="#"
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
  /* end pattern code */
);

export default survey;
