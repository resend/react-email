import {
  Column,
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
  <Section>
    <Hr className="!border-gray-300 my-[16px]" />
    <Row width={undefined}>
      <Column
        width="48"
        height="48"
        className="pt-[5px] h-[48px] w-[48px]"
        align="left"
      >
        <Img
          alt="Steve Jobs"
          className="block h-[48px] w-[48px] rounded-full object-cover object-center"
          height="48"
          src="https://react.email/static/steve-jobs.jpg"
          width="48"
        />
      </Column>
      <Column
        width="120"
        className="pl-[18px] w-[120px]"
        align="left"
        valign="top"
      >
        <Heading
          as="h3"
          className="m-[0px] font-medium text-[14px] text-gray-800 leading-[20px]"
        >
          Steve Jobs
        </Heading>
        <Text className="m-[0px] font-medium text-[12px] text-gray-500 leading-[14px]">
          Co-Founder & CEO
        </Text>
        <Row width={undefined} className="mt-[4px]" align={undefined}>
          <Column width={undefined} valign="middle">
            <Link className="h-[12px] w-[12px]" href="#">
              <Img
                alt="X"
                src="https://react.email/static/x-icon.png"
                width="12"
                height="12"
                style={{ height: '12px', width: '12px' }}
              />
            </Link>
          </Column>
          <Column width={undefined} className="pl-[8px]" valign="middle">
            <Link className="h-[12px] w-[12px]" href="#">
              <Img
                alt="LinkedIn"
                src="https://react.email/static/in-icon.png"
                width="12"
                height="12"
                style={{ height: '12px', width: '12px' }}
              />
            </Link>
          </Column>
        </Row>
      </Column>
    </Row>
  </Section>
);

export default () => {
  return <Layout>{component}</Layout>;
};
