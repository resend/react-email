import { Img } from '@react-email/components';
import { ResponsiveColumn, ResponsiveRow } from '@responsive-email/react-email';
import { Layout } from '../_components/layout';

export const component = (
  <ResponsiveRow className="mx-[12px] my-[16px] text-[14px] text-gray-600">
    <ResponsiveColumn className="mt-0 mr-[24px] mb-[24px] ml-0 w-64 overflow-hidden rounded-3xl">
      <Img
        src="/static/steve-jobs.jpg"
        width={320}
        height={320}
        alt="Steve Jobs"
        className="h-[320px] w-full object-cover object-center"
      />
    </ResponsiveColumn>
    <ResponsiveColumn className="pr-[24px]">
      <p className="mx-0 my-0 mb-[24px] text-left text-[16px] leading-[1.625] font-light text-gray-700">
        Design is not just what it looks like and feels like. Design is how it
        works. The people who are crazy enough to think they can change the
        world are the ones who do. Innovation distinguishes between a leader and
        a follower.
      </p>
      <p className="mx-0 mt-0 mb-[4px] text-left text-[16px] font-semibold text-gray-800">
        Steve Jobs
      </p>
      <p className="m-0 text-left text-[14px] text-gray-600">
        Co-founder of Apple
      </p>
    </ResponsiveColumn>
  </ResponsiveRow>
);

export default () => {
  return <Layout>{component}</Layout>;
};
