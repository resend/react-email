import { Column, Row } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <>
    <Row cellSpacing={8}>
      <Column
        align="center"
        style={{
          width: '50%',
          height: 40,
          backgroundColor: 'rgb(52,211,153,0.6)',
        }}
      >
        1/2
      </Column>
      <Column
        align="center"
        style={{
          width: '50%',
          height: 40,
          backgroundColor: 'rgb(34,211,238,0.6)',
        }}
      >
        1/2
      </Column>
    </Row>
    <Row>
      <Column
        align="center"
        style={{
          width: '33.333333%',
          height: 40,
          backgroundColor: 'rgb(244,114,182,0.6)',
        }}
      >
        1/3
      </Column>
      <Column
        align="center"
        style={{
          width: '66.666667%',
          height: 40,
          backgroundColor: 'rgb(192,132,252,0.6)',
        }}
      >
        2/3
      </Column>
    </Row>
  </>
);

export default () => {
  return <Layout>{component}</Layout>;
};
