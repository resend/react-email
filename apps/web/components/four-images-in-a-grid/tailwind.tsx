/* eslint-disable react/no-unescaped-entities */
import { Column, Link, Img, Row, Section, Text } from "@react-email/components";
import { Layout } from "../_components/layout";

// Good callouts for users:
// - Recommended proportions for all images is 292x288.

export const component = (
  <Section className="m-[16px]">
    <Section className="mt-[4px]">
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
      <Row className="mt-[16px]">
        <Column className="w-[50%] pr-[8px]">
          <Link href="#">
            <Img
              alt="Picture of part of a camera with other things around it, all unfocused except the camera piece."
              className="w-full rounded-[12px] object-cover"
              height={288}
              src="https://images.unsplash.com/photo-1617005082133-548c4dd27f35?q=80&w=2864&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />
          </Link>
        </Column>
        <Column className="w-[50%] pl-[8px]">
          <Link href="#">
            <Img
              alt="Picture of a white background, with a kettle on the left and some coffee being filtered into a glass recipient on the right."
              className="w-full rounded-[12px] object-cover"
              height={288}
              src="https://images.unsplash.com/photo-1570569962804-5377da5be035?q=80&w=2995&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />
          </Link>
        </Column>
      </Row>
      <Row className="mt-[16px]">
        <Column className="w-[50%] pr-[8px]">
          <Link href="#">
            <Img
              alt="A picture of various Apple products laid out on a table. There is an Apple Watch with its box bellow it, there is a MacBook Pro with its box bellow it, there is an Iphone with some box bellow it, there is an Apple Keyboard, and some other items that can't quite be recognized from the picture"
              className="w-full rounded-[12px] object-cover"
              height={288}
              src="https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=2864&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />
          </Link>
        </Column>
        <Column className="w-[50%] pl-[8px]">
          <Link href="#">
            <Img
              alt="A hand holding a blue water bottle with water poring down around it, all on a bage background."
              className="w-full rounded-[12px] object-cover"
              height={288}
              src="https://images.unsplash.com/photo-1610824352934-c10d87b700cc?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
