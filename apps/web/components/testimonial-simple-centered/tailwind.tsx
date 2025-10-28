import { Column, Img, Row, Section } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Section className="text-center text-[14px] leading-[20px] text-gray-600">
    <p className="m-0 text-[16px] leading-[24px] font-light text-gray-800">
      Design is not just what it looks like and feels like. Design is how it
      works. The people who are crazy enough to think they can change the world
      are the ones who do. Innovation distinguishes between a leader and a
      follower.
    </p>
    <Row width={undefined} align="center" className="mt-8">
      <Column
        valign="middle"
        width="32"
        height="32"
        className="h-[32px] w-[32px] rounded-full overflow-hidden bg-gray-600"
      >
        <Img
          src="/static/steve-jobs.jpg"
          width={32}
          height={32}
          alt="Steve Jobs"
          className="h-[32px] w-[32px] object-cover"
        />
      </Column>
      <Column valign="middle">
        <p className="m-0 ml-[12px] text-[14px] leading-[20px] font-semibold text-gray-900 mr-[8px]">
          Steve Jobs
        </p>
      </Column>
      <Column valign="middle">
        <span className="text-[14px] leading-[20px] mr-[8px]">•</span>
      </Column>
      <Column valign="middle">
        <p className="m-0 text-[14px] leading-[20px]">
          Co-founder of Apple
        </p>
      </Column>
    </Row>
  </Section>
);

export default () => {
  return <Layout>{component}</Layout>;
};
