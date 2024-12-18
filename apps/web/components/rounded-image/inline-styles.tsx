import { Img } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Img
    alt="Stagg Electric Kettle"
    height={250}
    src="/static/stagg-eletric-kettle.jpg"
    style={{ borderRadius: 12, margin: '0 auto' }}
  />
);

export default () => {
  return <Layout>{component}</Layout>;
};
