import { Img, Section } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Section className="text-center text-[14px] leading-[20px] text-gray-600">
    <p className="m-0 text-[16px] leading-[24px] font-light text-gray-800">
      Design is not just what it looks like and feels like. Design is how it
      works. The people who are crazy enough to think they can change the world
      are the ones who do. Innovation distinguishes between a leader and a
      follower.
    </p>
    <div className="mt-8 flex items-center justify-center gap-3">
      <div className="h-8 w-8 flex-shrink-0 rounded-full overflow-hidden bg-gray-600">
        <Img
          src="/static/steve-jobs.jpg"
          width={32}
          height={32}
          alt="Steve Jobs"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex items-center gap-2">
        <p className="m-0 text-[14px] leading-[20px] font-semibold text-gray-900">
          Steve Jobs
        </p>
        <span className="text-[14px] leading-[20px]">•</span>
        <p className="m-0 text-[14px] leading-[20px]">Co-founder of Apple</p>
      </div>
    </div>
  </Section>
);

export default () => {
  return <Layout>{component}</Layout>;
};
