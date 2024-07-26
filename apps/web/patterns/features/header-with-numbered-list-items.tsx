import { Column, Hr, Row, Section, Text } from "@react-email/components";
import { Layout } from "../_components/layout";

export const title = "Header with numbered list items";

export const Tailwind = () => {
  return (
    <Layout>
      {/* start pattern code */}
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
        <Hr className="mx-0 my-6 w-full border border-solid border-gray-200" />
        <Section>
          <Row>
            <Column className="align-baseline">
              <table className="text-center">
                <td
                  align="center"
                  className="h-10 w-10 bg-indigo-200 rounded-full p-0"
                >
                  <Text className="font-semibold m-0 text-indigo-600">1</Text>
                </td>
              </table>
            </Column>
            <Column className="w-[90%]">
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
        <Hr className="mx-0 my-6 w-full border border-solid border-gray-200" />
        <Section>
          <Row>
            <Column className="align-baseline">
              <table className="text-center">
                <td
                  align="center"
                  className="h-10 w-10 bg-indigo-200 rounded-full p-0"
                >
                  <Text className="font-semibold m-0 text-indigo-600">2</Text>
                </td>
              </table>
            </Column>
            <Column className="w-[90%]">
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
        <Hr className="mx-0 my-6 w-full border border-solid border-gray-200" />
        <Section>
          <Row>
            <Column className="align-baseline">
              <table className="text-center">
                <td
                  align="center"
                  className="h-10 w-10 bg-indigo-200 rounded-full p-0"
                >
                  <Text className="font-semibold m-0 text-indigo-600">3</Text>
                </td>
              </table>
            </Column>
            <Column className="w-[90%]">
              <Text className="m-0 text-xl font-semibold text-gray-900">
                Unleash Creativity
              </Text>
              <Text className="m-0 mt-2 text-base text-gray-500">
                Unleash your inner designer with our customizable furniture
                options, allowing you to create a space that reflects your
                unique vision
              </Text>
            </Column>
          </Row>
        </Section>
        <Hr className="mx-0 my-6 w-full border border-solid border-gray-200" />
        <Section>
          <Row>
            <Column className="align-baseline">
              <table className="text-center">
                <td
                  align="center"
                  className="h-10 w-10 bg-indigo-200 rounded-full p-0"
                >
                  <Text className="font-semibold m-0 text-indigo-600">4</Text>
                </td>
              </table>
            </Column>
            <Column className="w-[90%]">
              <Text className="m-0 text-xl font-semibold text-gray-900">
                Elevate Outdoor Living
              </Text>
              <Text className="m-0 mt-2 text-base text-gray-500">
                Take your outdoor space to new heights with our premium outdoor
                furniture, designed to elevate your alfresco experience.
              </Text>
            </Column>
          </Row>
        </Section>
        <Hr className="mx-0 my-6 w-full border border-solid border-gray-200" />
      </Section>
      {/* end pattern code */}
    </Layout>
  );
};

export const InlineStyles = () => {
  return (
    <Layout>
      {/* start pattern code */}
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
        <Hr
          style={{
            marginLeft: 0,
            marginRight: 0,
            marginTop: 24,
            marginBottom: 24,
            width: "100%",
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "rgb(229,231,235)",
          }}
        />
        <Section>
          <Row>
            <Column style={{ verticalAlign: "baseline" }}>
              <table style={{ textAlign: "center" }}>
                <td
                  align="center"
                  style={{
                    height: 40,
                    width: 40,
                    backgroundColor: "rgb(199,210,254)",
                    borderRadius: 9999,
                    padding: 0,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: 600,
                      margin: 0,
                      color: "rgb(79,70,229)",
                    }}
                  >
                    1
                  </Text>
                </td>
              </table>
            </Column>
            <Column style={{ width: "90%" }}>
              <Text
                style={{
                  margin: 0,
                  fontSize: 20,
                  lineHeight: "28px",
                  fontWeight: 600,
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
            marginTop: 24,
            marginBottom: 24,
            width: "100%",
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "rgb(229,231,235)",
          }}
        />
        <Section>
          <Row>
            <Column style={{ verticalAlign: "baseline" }}>
              <table style={{ textAlign: "center" }}>
                <td
                  align="center"
                  style={{
                    height: 40,
                    width: 40,
                    backgroundColor: "rgb(199,210,254)",
                    borderRadius: 9999,
                    padding: 0,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: 600,
                      margin: 0,
                      color: "rgb(79,70,229)",
                    }}
                  >
                    2
                  </Text>
                </td>
              </table>
            </Column>
            <Column style={{ width: "90%" }}>
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
            marginTop: 24,
            marginBottom: 24,
            width: "100%",
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "rgb(229,231,235)",
          }}
        />
        <Section>
          <Row>
            <Column style={{ verticalAlign: "baseline" }}>
              <table style={{ textAlign: "center" }}>
                <td
                  align="center"
                  style={{
                    height: 40,
                    width: 40,
                    backgroundColor: "rgb(199,210,254)",
                    borderRadius: 9999,
                    padding: 0,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: 600,
                      margin: 0,
                      color: "rgb(79,70,229)",
                    }}
                  >
                    3
                  </Text>
                </td>
              </table>
            </Column>
            <Column style={{ width: "90%" }}>
              <Text
                style={{
                  margin: 0,
                  fontSize: 20,
                  lineHeight: "28px",
                  fontWeight: 600,
                  color: "rgb(17,24,39)",
                }}
              >
                Unleash Creativity
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
                Unleash your inner designer with our customizable furniture
                options, allowing you to create a space that reflects your
                unique vision
              </Text>
            </Column>
          </Row>
        </Section>
        <Hr
          style={{
            marginLeft: 0,
            marginRight: 0,
            marginTop: 24,
            marginBottom: 24,
            width: "100%",
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "rgb(229,231,235)",
          }}
        />
        <Section>
          <Row>
            <Column style={{ verticalAlign: "baseline" }}>
              <table style={{ textAlign: "center" }}>
                <td
                  align="center"
                  style={{
                    height: 40,
                    width: 40,
                    backgroundColor: "rgb(199,210,254)",
                    borderRadius: 9999,
                    padding: 0,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: 600,
                      margin: 0,
                      color: "rgb(79,70,229)",
                    }}
                  >
                    4
                  </Text>
                </td>
              </table>
            </Column>
            <Column style={{ width: "90%" }}>
              <Text
                style={{
                  margin: 0,
                  fontSize: 20,
                  lineHeight: "28px",
                  fontWeight: 600,
                  color: "rgb(17,24,39)",
                }}
              >
                Elevate Outdoor Living
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
                Take your outdoor space to new heights with our premium outdoor
                furniture, designed to elevate your alfresco experience.
              </Text>
            </Column>
          </Row>
        </Section>
        <Hr
          style={{
            marginLeft: 0,
            marginRight: 0,
            marginTop: 24,
            marginBottom: 24,
            width: "100%",
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "rgb(229,231,235)",
          }}
        />
      </Section>
      {/* end pattern code */}
    </Layout>
  );
};

export default InlineStyles;
