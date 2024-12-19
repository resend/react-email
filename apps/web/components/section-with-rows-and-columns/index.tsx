import { Column, Row, Section } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Section>
    <Row>
      <Column>Column 1, Row 1</Column>
      <Column>Column 2, Row 1</Column>
    </Row>
    <Row>
      <Column>Column 1, Row 2</Column>
      <Column>Column 2, Row 2</Column>
    </Row>
  </Section>
);

export default () => {
  return <Layout>{component}</Layout>;
};
