import { Column, Img, Link, Row, Section, Text } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Section className="my-[16px]">
    <Section>
      <Row>
        <Text className="m-0 text-[16px] font-semibold leading-[24px] text-indigo-600">
          Collections
        </Text>
        <Text className="m-0 mt-[8px] text-[24px] font-semibold leading-[32px] text-gray-900">
          Bundle & Save
        </Text>
        <Text className="mt-[8px] text-[16px] leading-[24px] text-gray-500">
          Award-winning grinders and burrs for brewing like a barista at home.
        </Text>
      </Row>
    </Section>
    <Section className="mt-[16px]">
      <Row className="mt-[16px]">
        <Column className="w-1/2 pr-[8px]">
          <Row className="pb-[8px]">
            <td>
              <Link href="#">
                <Img
                  alt="Grinder Collection"
                  className="w-full rounded-[12px] object-cover"
                  height={152}
                  src="/static/grinder-collection.jpg"
                />
              </Link>
            </td>
          </Row>
          <Row className="pt-[8px]">
            <td>
              <Link href="#">
                <Img
                  alt="Bundle Collection"
                  className="w-full rounded-[12px] object-cover"
                  height={152}
                  src="/static/bundle-collection.jpg"
                />
              </Link>
            </td>
          </Row>
        </Column>
        <Column className="w-1/2 py-[8px] pl-[8px]">
          <Link href="#">
            <Img
              alt="Clara French Press"
              className="w-full rounded-[12px] object-cover"
              height={152 + 152 + 8 + 8}
              src="/static/clara-french-press.jpg"
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
