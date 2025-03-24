import { Column, Row } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <>
    <Row cellSpacing={8}>
      <Column align="center" className="h-[40px] w-1/2 bg-emerald-400/60">
        1/2
      </Column>
      <Column align="center" className="h-[40px] w-1/2 bg-cyan-400/60">
        1/2
      </Column>
    </Row>
    <Row>
      <Column align="center" className="h-[40px] w-1/3 bg-pink-400/60">
        1/3
      </Column>
      <Column align="center" className="h-[40px] w-2/3 bg-purple-400/60">
        2/3
      </Column>
    </Row>
  </>
);

export default () => {
  return <Layout>{component}</Layout>;
};
