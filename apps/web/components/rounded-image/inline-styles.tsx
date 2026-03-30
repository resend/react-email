import { Img } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Img
    alt="Stagg Electric Kettle"
    width={250}
    height={250}
    src="/static/stagg-eletric-kettle.jpg"
    style={{
      borderRadius: 12,
      marginTop: '0',
      marginBottom: '0',
      marginLeft: 'auto',
      marginRight: 'auto',
    }}
  />
);

export default () => {
  return <Layout>{component}</Layout>;
};
