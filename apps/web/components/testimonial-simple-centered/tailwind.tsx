import { Img } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <div className="flex flex-col items-center justify-center gap-8 text-center text-sm text-gray-500">
    <p className="m-0 text-base leading-relaxed font-light text-gray-800">
      Design is not just what it looks like and feels like. Design is how it
      works. The people who are crazy enough to think they can change the world
      are the ones who do. Innovation distinguishes between a leader and a
      follower.
    </p>
    <div className="flex flex-col items-center justify-center gap-5">
      <div className="h-8 w-8 overflow-hidden rounded-full bg-gray-600">
        <Img
          src="/static/steve-jobs.jpg"
          width={320}
          height={320}
          alt="Steve Jobs"
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="flex w-fit gap-2 [&>*]:m-0">
        <p className="font-semibold text-gray-900">Steve Jobs</p>
        <span>•</span>
        <p>Co-founder of Apple</p>
      </div>
    </div>
  </div>
);

export default () => {
  return <Layout>{component}</Layout>;
};
