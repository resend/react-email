/* eslint-disable react/no-unescaped-entities */
import { Column, Link, Img, Row, Section, Text } from "@react-email/components";
import { Layout } from "../_components/layout";

// Good callouts for users:
// - Recommended proportions for all images is 192x186.

export const title = "3 columns with images";

export const Tailwind = () => {
  return (
    <Section className="my-4">
      <Section>
        <Row>
          <Text className="m-0 text-base font-semibold text-indigo-600">
            What's new
          </Text>
          <Text className="m-0 mt-2 text-2xl font-semibold text-gray-900">
            Functional Style
          </Text>
          <Text className="mt-2 text-base text-gray-500">
            Combine practicality and style effortlessly with our furniture,
            offering functional designs that enhance your living space
          </Text>
        </Row>
      </Section>
      <Section>
        <Row>
          <Column className="w-1/3 pr-2">
            <Link href="#">
              <Img
                alt="Picture of part of a camera with other things around it, all unfocused except the camera piece."
                className="w-full rounded-xl object-cover"
                height={186}
                src="https://images.unsplash.com/photo-1617005082133-548c4dd27f35?q=80&w=2864&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              />
            </Link>
          </Column>
          <Column className="w-1/3 px-2">
            <Link href="#">
              <Img
                alt="Picture of a white background, with a kettle on the left and some coffee being filtered into a glass recipient on the right."
                className="w-full rounded-xl object-cover"
                height={186}
                src="https://images.unsplash.com/photo-1570569962804-5377da5be035?q=80&w=2995&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              />
            </Link>
          </Column>
          <Column className="w-1/3 pl-2">
            <Link href="#">
              <Img
                alt="A hand holding a blue water bottle with water poring down around it, all on a bage background."
                className="w-full rounded-xl object-cover"
                height={186}
                src="https://images.unsplash.com/photo-1610824352934-c10d87b700cc?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              />
            </Link>
          </Column>
        </Row>
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
              fontSize: 16,
              lineHeight: "24px",
              fontWeight: 600,
              color: "rgb(79,70,229)",
            }}
          >
            What's new
          </Text>
          <Text
            style={{
              margin: 0,
              marginTop: 8,
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
        <Row>
          <Column style={{ width: "33.3333%", paddingRight: 8 }}>
            <Link href="#">
              <Img
                alt="Picture of part of a camera with other things around it, all unfocused except the camera piece."
                height={186}
                src="https://images.unsplash.com/photo-1617005082133-548c4dd27f35?q=80&w=2864&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                style={{
                  width: "100%",
                  borderRadius: 12,
                  objectFit: "cover",
                }}
              />
            </Link>
          </Column>
          <Column
            style={{ width: "33.3333%", paddingLeft: 8, paddingRight: 8 }}
          >
            <Link href="#">
              <Img
                alt="Picture of a white background, with a kettle on the left and some coffee being filtered into a glass recipient on the right."
                height={186}
                src="https://images.unsplash.com/photo-1570569962804-5377da5be035?q=80&w=2995&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                style={{
                  width: "100%",
                  borderRadius: 12,
                  objectFit: "cover",
                }}
              />
            </Link>
          </Column>
          <Column style={{ width: "33.3333%", paddingLeft: 8 }}>
            <Link href="#">
              <Img
                alt="A hand holding a blue water bottle with water poring down around it, all on a bage background."
                height={186}
                src="https://images.unsplash.com/photo-1610824352934-c10d87b700cc?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                style={{
                  width: "100%",
                  borderRadius: 12,
                  objectFit: "cover",
                }}
              />
            </Link>
          </Column>
        </Row>
      </Section>
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
