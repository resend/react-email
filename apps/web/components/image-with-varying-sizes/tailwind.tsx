import { Img } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <>
    <Img
      alt="Atoms Vacuum Canister"
      className="rounded-[12px] my-[12px] mx-auto"
      width={150}
      height={150}
      src="/static/atmos-vacuum-canister.jpg"
    />
    <Img
      alt="Atoms Vacuum Canister"
      className="rounded-[12px] my-[12px] mx-auto"
      width={200}
      height={200}
      src="/static/atmos-vacuum-canister.jpg"
    />
    <Img
      alt="Atoms Vacuum Canister"
      className="rounded-[12px] my-[12px] mx-auto"
      width={250}
      height={250}
      src="/static/atmos-vacuum-canister.jpg"
    />
  </>
);

export default () => {
  return <Layout>{component}</Layout>;
};
