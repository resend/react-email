import { Img } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Img
    alt="Ode Grinder"
    className="mx-auto"
    width={250}
    height={250}
    src="/static/ode-grinder.jpg"
  />
);

export default () => {
  return <Layout>{component}</Layout>;
};
