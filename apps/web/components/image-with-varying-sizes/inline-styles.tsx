import { Img } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <>
    <Img
      alt="Atoms Vacuum Canister"
      height={150}
      src="/static/atmos-vacuum-canister.jpg"
      style={{ borderRadius: 12, margin: '12px auto 12px' }}
    />
    <Img
      alt="Atoms Vacuum Canister"
      height={200}
      src="/static/atmos-vacuum-canister.jpg"
      style={{ borderRadius: 12, margin: '12px auto 12px' }}
    />
    <Img
      alt="Atoms Vacuum Canister"
      height={250}
      src="/static/atmos-vacuum-canister.jpg"
      style={{ borderRadius: 12, margin: '12px auto 12px' }}
    />
  </>
);

export default () => {
  return <Layout>{component}</Layout>;
};
