import { Column, Hr, Img, Row, Section, Text } from "@react-email/components";
import { Layout } from "../_components/layout";

export const title = "Header with list items";

export const Tailwind = () => {
  return (
    <Section className="my-4">
      <Section>
        <Row>
          <Text className="m-0 text-2xl font-semibold text-gray-900">
            Functional Style
          </Text>
          <Text className="mt-2 text-base text-gray-500">
            Combine practicality and style effortlessly with our furniture,
            offering functional designs that enhance your living space
          </Text>
        </Row>
      </Section>
      <Section>
        <Hr className="mx-0 my-8 w-full border border-solid border-gray-200" />
        <Section>
          <Row>
            <Column className="align-baseline">
              <Img
                alt="heart icon"
                height="48"
                src="/static/heart-icon.png"
                width="48"
              />
            </Column>
            <Column className="w-[85%]">
              <Text className="m-0 text-xl font-semibold text-gray-900">
                Versatile Comfort
              </Text>
              <Text className="m-0 mt-2 text-base text-gray-500">
                Experience ultimate comfort and versatility with our furniture
                collection, designed to adapt to your ever-changing needs.
              </Text>
            </Column>
          </Row>
        </Section>
        <Hr className="mx-0 my-8 w-full border border-solid border-gray-200" />
        <Section>
          <Row>
            <Column className="align-baseline">
              <Img
                alt="rocket icon"
                height="48"
                src="/static/rocket-icon.png"
                width="48"
              />
            </Column>
            <Column className="w-[85%]">
              <Text className="m-0 text-xl font-semibold text-gray-900">
                Luxurious Retreat
              </Text>
              <Text className="m-0 mt-2 text-base text-gray-500">
                Transform your space into a haven of relaxation with our
                indulgent furniture collection.
              </Text>
            </Column>
          </Row>
        </Section>
        <Hr className="mx-0 my-8 w-full border border-solid border-gray-200" />
      </Section>
    </Section>
  );
};

export const InlineStyles = () => {
  return (
    <Section style={{ marginTop: 16, marginBottom: 16 }}>
      <Section>
        <Row>
          <Text
            style={{
              margin: 0,
              fontSize: 24,
              lineHeight: "32px",
              fontWeight: 600,
              color: "rgb(17,24,39)",
            }}
          >
            Functional Style
          </Text>
          <Text
            style={{
              marginTop: 8,
              fontSize: 16,
              lineHeight: "24px",
              color: "rgb(107,114,128)",
            }}
          >
            Combine practicality and style effortlessly with our furniture,
            offering functional designs that enhance your living space
          </Text>
        </Row>
      </Section>
      <Section>
        <Hr
          style={{
            marginLeft: 0,
            marginRight: 0,
            marginTop: 32,
            marginBottom: 32,
            width: "100%",
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "rgb(229,231,235)",
          }}
        />
        <Section>
          <Row>
            <Column style={{ verticalAlign: "baseline" }}>
              <Img
                alt="heart icon"
                height="48"
                src="/static/heart-icon.png"
                width="48"
              />
            </Column>
            <Column style={{ width: "85%" }}>
              <Text
                style={{
                  margin: 0,
                  fontSize: 20,
                  lineHeight: "28px",
                  color: "rgb(17,24,39)",
                }}
              >
                Versatile Comfort
              </Text>
              <Text
                style={{
                  margin: 0,
                  marginTop: 8,
                  fontSize: 16,
                  lineHeight: "24px",
                  color: "rgb(107,114,128)",
                }}
              >
                Experience ultimate comfort and versatility with our furniture
                collection, designed to adapt to your ever-changing needs.
              </Text>
            </Column>
          </Row>
        </Section>
        <Hr
          style={{
            marginLeft: 0,
            marginRight: 0,
            marginTop: 32,
            marginBottom: 32,
            width: "100%",
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "rgb(229,231,235)",
          }}
        />
        <Section>
          <Row>
            <Column style={{ verticalAlign: "baseline" }}>
              <Img
                alt="rocket icon"
                height="48"
                src="/static/rocket-icon.png"
                width="48"
              />
            </Column>
            <Column style={{ width: "85%" }}>
              <Text
                style={{
                  margin: 0,
                  fontSize: 20,
                  lineHeight: "28px",
                  fontWeight: 600,
                  color: "rgb(17,24,39)",
                }}
              >
                Luxurious Retreat
              </Text>
              <Text
                style={{
                  margin: 0,
                  marginTop: 8,
                  fontSize: 16,
                  lineHeight: "24px",
                  color: "rgb(107,114,128)",
                }}
              >
                Transform your space into a haven of relaxation with our
                indulgent furniture collection.
              </Text>
            </Column>
          </Row>
        </Section>
        <Hr
          style={{
            marginLeft: 0,
            marginRight: 0,
            marginTop: 32,
            marginBottom: 32,
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "rgb(229,231,235)",
          }}
        />
      </Section>
    </Section>
  );
};

export default () => {
  return <Layout>
    <InlineStyles/>
  </Layout>
};
