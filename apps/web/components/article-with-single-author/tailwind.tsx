import {
  Heading,
  Hr,
  Img,
  Link,
  Row,
  Section,
  Text,
} from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Row>
    <Hr className="!border-gray-300 my-[16px]" />
    <Section className="mt-[5px] inline-block max-h-[48px] max-w-[48px] text-left">
      <Img
        alt="Steve Jobs"
        className="block h-[48px] w-[48px] rounded-full object-cover object-center"
        height={48}
        src="/static/steve-jobs.jpg"
        width={48}
      />
    </Section>
    <Section className="ml-[18px] inline-block max-w-[120px] text-left align-top">
      <Heading
        as="h3"
        className="m-[0px] font-medium text-[14px] text-gray-800 leading-[20px]"
      >
        Steve Jobs
      </Heading>
      <Text className="m-[0px] font-medium text-[12px] text-gray-500 leading-[14px]">
        Co-Founder & CEO
      </Text>
      <Section className="mt-[4px]">
        <Link className="inline-flex h-[12px] w-[12px]" href="#">
          <Img
            alt="X"
            src="/static/x-icon.png"
            style={{ height: '12px', width: '12px' }}
          />
        </Link>
        <Link className="ml-[8px] inline-flex h-[12px] w-[12px]" href="#">
          <Img
            alt="LinkedIn"
            src="/static/in-icon.png"
            style={{ height: '12px', width: '12px' }}
          />
        </Link>
      </Section>
    </Section>
  </Row>
);

export default () => {
  return <Layout>{component}</Layout>;
};
