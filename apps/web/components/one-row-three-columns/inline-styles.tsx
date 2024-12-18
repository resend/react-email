import { Column, Row } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Row>
    <Column
      align="center"
      style={{
        width: '33.333333%',
        height: 40,
        backgroundColor: 'rgb(251,146,60,0.6)',
      }}
    >
      1/3
    </Column>
    <Column
      align="center"
      style={{
        width: '33.333333%',
        height: 40,
        backgroundColor: 'rgb(52,211,153,0.6)',
      }}
    >
      1/3
    </Column>
    <Column
      align="center"
      style={{
        width: '33.333333%',
        height: 40,
        backgroundColor: 'rgb(34,211,238,0.6)',
      }}
    >
      1/3
    </Column>
  </Row>
);

export default () => {
  return <Layout>{component}</Layout>;
};
