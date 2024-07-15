/* eslint-disable react/no-unescaped-entities */
import { Column, Link, Img, Row, Section, Text } from "@react-email/components";

export const title = "3 columns with images";

export const threeColumnsWithImages = (
  /* start pattern code */
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
    <Section className="mt-4">
      <Row className="mt-4">
        <Column className="w-1/3 pr-2">
          <Link href="#">
            <Img
              className="w-full rounded-xl object-cover"
              height={186}
              src="https://images.unsplash.com/photo-1617005082133-548c4dd27f35?q=80&w=2864&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />
          </Link>
        </Column>
        <Column className="w-1/3 px-2">
          <Link href="#">
            <Img
              className="w-full rounded-xl object-cover"
              height={186}
              src="https://images.unsplash.com/photo-1570569962804-5377da5be035?q=80&w=2995&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />
          </Link>
        </Column>
        <Column className="w-1/3 pl-2">
          <Link href="#">
            <Img
              className="w-full rounded-xl object-cover"
              height={186}
              src="https://images.unsplash.com/photo-1610824352934-c10d87b700cc?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />
          </Link>
        </Column>
      </Row>
    </Section>
  </Section>
  /* end pattern code */
);

export default threeColumnsWithImages;
