import { Column, Hr, Row } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <>
    <Row>
      <Column>First column</Column>
      <Column>Second column</Column>
    </Row>
    <Hr
      style={{
        marginTop: 16,
        borderColor: 'rgb(209,213,219)',
        marginBottom: 16,
      }}
    />
    <Row>
      <Column>First column</Column>
      <Column>Second column</Column>
    </Row>
  </>
);

export default () => {
  return <Layout>{component}</Layout>;
};
