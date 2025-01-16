import { Column, Row } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Row>
    <Column align="center" className="h-[40px] w-1/3 bg-orange-400/60">
      1/3
    </Column>
    <Column align="center" className="h-[40px] w-1/3 bg-emerald-400/60">
      1/3
    </Column>
    <Column align="center" className="h-[40px] w-1/3 bg-cyan-400/60">
      1/3
    </Column>
  </Row>
);

export default () => {
  return <Layout>{component}</Layout>;
};
