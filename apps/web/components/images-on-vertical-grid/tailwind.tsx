/* eslint-disable react/no-unescaped-entities */
import { Column, Link, Img, Row, Section, Text } from "@react-email/components";
import { Layout } from "../_components/layout";

// Good callouts for users:
// - Recommended proportions for images 600x288, 292x268 and 292x268.

export const component = (
  <Section className="m-[16px]">
    <Section>
      <Row>
        <Text className="m-0 text-[16px] font-semibold leading-[24px] text-indigo-600">
          What's new
        </Text>
        <Text className="m-0 mt-[8px] text-[24px] font-semibold leading-[32px] text-gray-900">
          Functional Style
        </Text>
        <Text className="mt-[8px] text-[16px] leading-[24px] text-gray-500">
          Combine practicality and style effortlessly with our furniture,
          offering functional designs that enhance your living space
        </Text>
      </Row>
    </Section>
    <Section className="mt-[16px]">
      <Link href="#">
        <Img
          alt="Two matching shoes on a white background. The second one is tilted diagonally being supported by a white box. The first one is on top of the same box"
          className="rounded-[12px] object-cover"
          height={288}
          src="https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=2898&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          width="100%"
        />
      </Link>
      <Row className="mt-[16px]">
        <Column className="w-1/2 pr-[8px]">
          <Link href="#">
            <Img
              alt="A picture of various Apple products laid out on a table. There is an Apple Watch with its box bellow it, there is a MacBook Pro with its box bellow it, there is an Iphone with some box bellow it, there is an Apple Keyboard, and some other items that can't quite be recognized from the picture"
              className="rounded-[12px] object-cover"
              height={288}
              src="https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=2864&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              width="100%"
            />
          </Link>
        </Column>
        <Column className="w-1/2 pl-[8px]">
          <Link href="#">
            <Img
              alt="A hand holding a blue water bottle with water poring down around it, all on a bage background."
              className="rounded-[12px] object-cover"
              height={288}
              src="https://images.unsplash.com/photo-1610824352934-c10d87b700cc?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              width="100%"
            />
          </Link>
        </Column>
      </Row>
    </Section>
  </Section>
);

export default () => {
  return <Layout>{component}</Layout>;
};
