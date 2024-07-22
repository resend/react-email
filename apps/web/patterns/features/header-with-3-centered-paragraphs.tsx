import { Column, Img, Row, Section, Text } from "@react-email/components";
import { Layout } from "../_components/layout";

export const title = "Header with three centered paragraphs";

export const HeaderWithThreeCenteredParagraphs = () => {
  return (
    <Layout>
      {/* start pattern code */}
      <Section className="my-4">
        <Row>
          <Text className="m-0 text-2xl font-semibold text-gray-900">
            Modern Comfort
          </Text>
          <Text className="mt-2 text-base text-gray-500">
            Experience contemporary bliss with our sleek and cozy furniture
            collection, designed for optimal comfort and style
          </Text>
        </Row>
        <Row className="mt-4">
          <Column align="center" className="w-1/3 pr-3 align-baseline">
            <Img
              alt="heart icon"
              height="48"
              src="/static/heart-icon.png"
              width="48"
            />
            <Text className="m-0 mt-4 text-xl font-semibold text-gray-900">
              Timeless Charm
            </Text>
            <Text className="mb-0 mt-2 text-base text-gray-500">
              Classic designs that never go out of style. Experience enduring
              elegance
            </Text>
          </Column>
          <Column align="center" className="w-1/3 pl-3 align-baseline">
            <Img
              alt="rocket icon"
              height="48"
              src="/static/rocket-icon.png"
              width="48"
            />
            <Text className="m-0 mt-4 text-xl font-semibold text-gray-900">
              Functional Beauty
            </Text>
            <Text className="mb-0 mt-2 text-base text-gray-500">
              Seamlessly blending form and function. Furniture that enhances
              your everyday life.
            </Text>
          </Column>
          <Column align="center" className="w-1/3 pl-3 align-baseline">
            <Img
              alt="megaphone icon"
              height="48"
              src="/static/megaphone-icon.png"
              width="48"
            />
            <Text className="m-0 mt-4 text-xl font-semibold text-gray-900">
              Endless Comfort
            </Text>
            <Text className="mb-0 mt-2 text-base text-gray-500">
              Sink into pure relaxation. Discover furniture that embraces your
              well-being.
            </Text>
          </Column>
        </Row>
      </Section>
      {/* end pattern code */}
    </Layout>
  );
};

export default HeaderWithThreeCenteredParagraphs;
