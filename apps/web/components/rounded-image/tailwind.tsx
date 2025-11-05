import { Img } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Img
    alt="Stagg Electric Kettle"
    className="rounded-[12px] my-0 mx-auto"
    width={250}
    height={250}
    src="/static/stagg-eletric-kettle.jpg"
  />
);

export default () => {
  return <Layout>{component}</Layout>;
};
