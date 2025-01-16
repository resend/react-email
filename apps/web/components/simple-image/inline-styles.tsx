import { Img } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Img
    alt="Ode Grinder"
    height={250}
    src="/static/ode-grinder.jpg"
    style={{ marginLeft: 'auto', marginRight: 'auto' }}
  />
);

export default () => {
  return <Layout>{component}</Layout>;
};
