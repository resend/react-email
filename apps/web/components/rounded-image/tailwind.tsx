import { Img } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Img
    alt="Stagg Electric Kettle"
    className="rounded-[12px] [margin:0_auto]"
    height={250}
    src="/static/stagg-eletric-kettle.jpg"
  />
);

export default () => {
  return <Layout>{component}</Layout>;
};
