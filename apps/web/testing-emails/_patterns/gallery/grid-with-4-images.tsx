/* eslint-disable react/no-unescaped-entities */
import { Column, Link, Img, Row, Section, Text } from "@react-email/components";

// Good callouts for users:
// - Recommended proportions for all images is 292x288.

export const title = "4 Images grid";

export const gridWith4Images = (
  /* start pattern code */
  <Section className="my-4">
    <Section className="mt-12">
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
        <Column className="w-[50%] pr-2">
          <Link href="#">
            <Img
              className="w-full rounded-xl object-cover"
              height={288}
              src="https://images.unsplash.com/photo-1617005082133-548c4dd27f35?q=80&w=2864&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />
          </Link>
        </Column>
        <Column className="w-[50%] pl-2">
          <Link href="#">
            <Img
              className="w-full rounded-xl object-cover"
              height={288}
              src="https://images.unsplash.com/photo-1570569962804-5377da5be035?q=80&w=2995&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />
          </Link>
        </Column>
      </Row>
      <Row className="mt-4">
        <Column className="w-[50%] pr-2">
          <Link href="#">
            <Img
              className="w-full rounded-xl object-cover"
              height={288}
              src="https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=2864&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />
          </Link>
        </Column>
        <Column className="w-[50%] pl-2">
          <Link href="#">
            <Img
              className="w-full rounded-xl object-cover"
              height={288}
              src="https://images.unsplash.com/photo-1610824352934-c10d87b700cc?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />
          </Link>
        </Column>
      </Row>
    </Section>
  </Section>
  /* end pattern code */
);

export default gridWith4Images;
