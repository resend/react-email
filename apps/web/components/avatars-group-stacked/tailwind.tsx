import { Img } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <div className="relative mx-auto flex w-fit overflow-hidden">
    <div className="relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-4 border-solid border-white bg-gray-950 text-sm font-semibold tracking-wide text-emerald-300">
      <Img
        src="https://github.com/bukinoshita.png?size=100"
        alt="Bu Kinoshita"
        width="40"
        height="40"
        className="inline-block h-full w-full object-cover object-center"
      />
    </div>
    <div className="relative -ml-3 inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-4 border-solid border-white bg-gray-950 text-sm font-semibold tracking-wide text-emerald-300">
      <Img
        src="https://github.com/bukinoshita.png?size=100"
        alt="Bu Kinoshita"
        width="40"
        height="40"
        className="inline-block h-full w-full object-cover object-center"
      />
    </div>
    <div className="relative -ml-3 inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-4 border-solid border-white bg-gray-950 text-sm font-semibold tracking-wide text-emerald-300">
      <Img
        src="https://github.com/bukinoshita.png?size=100"
        alt="Bu Kinoshita"
        width="40"
        height="40"
        className="inline-block h-full w-full object-cover object-center"
      />
    </div>
  </div>
);

export default () => {
  return <Layout>{component}</Layout>;
};
