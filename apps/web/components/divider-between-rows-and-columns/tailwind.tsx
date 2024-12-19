import { Column, Hr, Row } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <>
    <Row>
      <Column>First column</Column>
      <Column>Second column</Column>
    </Row>
    <Hr className="my-[16px] border-gray-300" />
    <Row>
      <Column>First column</Column>
      <Column>Second column</Column>
    </Row>
  </>
);

export default () => {
  return <Layout>{component}</Layout>;
};
