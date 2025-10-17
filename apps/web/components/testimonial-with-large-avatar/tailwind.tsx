import { Img } from '@react-email/components';
import { ResponsiveColumn, ResponsiveRow } from '@responsive-email/react-email';
import { Layout } from '../_components/layout';

export const component = (
  <ResponsiveRow className="m-3 text-left text-sm text-gray-500">
    <ResponsiveColumn className="m-6 ml-0 mt-0 w-64 overflow-hidden rounded-3xl">
      <Img
        src="/static/steve-jobs.jpg"
        width={320}
        height={320}
        alt="Steve Jobs"
        className="h-full w-full object-cover object-center"
      />
    </ResponsiveColumn>
    <ResponsiveColumn>
      <p className="m-0 mb-6 text-base leading-relaxed font-light text-gray-800">
        Design is not just what it looks like and feels like. Design is how it
        works. The people who are crazy enough to think they can change the
        world are the ones who do. Innovation distinguishes between a leader and
        a follower.
      </p>
      <div className="flex flex-col gap-1 [&>*]:m-0">
        <p className="text-base font-semibold text-gray-900">Steve Jobs</p>
        <p>Co-founder of Apple</p>
      </div>
    </ResponsiveColumn>
  </ResponsiveRow>
);

export default () => {
  return <Layout>{component}</Layout>;
};
