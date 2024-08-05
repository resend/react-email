import {
  Button,
  Column,
  Heading,
  Row,
  Section,
  Text,
} from "@react-email/components";
import { Layout } from "../_components/layout";

export const title = "Survey";

export const Tailwind = () => {
  return (
    <Section className="text-center py-4">
      <Text className="my-2 text-lg font-semibold text-indigo-600">
        Your opinion matters
      </Text>
      <Heading
        as="h1"
        className="m-0 mt-2 text-3xl font-semibold text-gray-900"
      >
        We want to hear from you
      </Heading>
      <Text className="text-base text-gray-700">
        How would you rate your experience using our product in a scale from 1
        to 5?
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
};

export const InlineStyles = () => {
  return (
    <Section
      style={{
        textAlign: "center",
        paddingTop: 16,
        paddingBottom: 16,
      }}
    >
      <Text
        style={{
          marginTop: 8,
          marginBottom: 8,
          fontSize: 18,
          lineHeight: "28px",
          fontWeight: 600,
          color: "rgb(79,70,229)",
        }}
      >
        Your opinion matters
      </Text>
      <Heading
        as="h1"
        style={{
          margin: 0,
          marginTop: 8,
          fontSize: 30,
          lineHeight: "36px",
          fontWeight: 600,
          color: "rgb(17,24,39)",
        }}
      >
        We want to hear from you
      </Heading>
      <Text
        style={{
          fontSize: 16,
          lineHeight: "24px",
          color: "rgb(55,65,81)",
        }}
      >
        How would you rate your experience using our product in a scale from 1
        to 5?
      </Text>
      <Row>
        <Column align="center">
          <table>
            <tr>
              {[1, 2, 3, 4, 5].map((number) => (
                <td align="center" key={number} style={{ padding: 4 }}>
                  <Button
                    // Replace with the proper URL that saves the selected number
                    href="https://react.email"
                    style={{
                      height: 20,
                      width: 20,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderStyle: "solid",
                      borderColor: "rgb(79,70,229)",
                      padding: 8,
                      fontWeight: 600,
                      color: "rgb(79,70,229)",
                    }}
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
};

export default () => {
  return (
    <Layout>
      <InlineStyles />
    </Layout>
  );
};
