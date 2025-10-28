import { Column, Img, Row } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Row>
    <Column align="center">
      <Img
        src="https://github.com/luxonauta.png?size=100"
        alt="Lucas de França"
        width="30"
        height="30"
        style={{
          display: 'inline-block',
          width: '30px',
          height: '30px',
          borderRadius: '9999px',
        }}
      />
    </Column>
    <Column align="center">
      <Img
        src="https://github.com/luxonauta.png?size=100"
        alt="Lucas de França"
        width="42"
        height="42"
        style={{
          display: 'inline-block',
          width: '42px',
          height: '42px',
          borderRadius: '9999px',
        }}
      />
    </Column>
    <Column align="center">
      <Img
        src="https://github.com/luxonauta.png?size=100"
        alt="Lucas de França"
        width="54"
        height="54"
        style={{
          display: 'inline-block',
          width: '54px',
          height: '54px',
          borderRadius: '9999px',
        }}
      />
    </Column>
    <Column align="center">
      <Img
        src="https://github.com/luxonauta.png?size=100"
        alt="Lucas de França"
        width="66"
        height="66"
        style={{
          display: 'inline-block',
          width: '66px',
          height: '66px',
          borderRadius: '9999px',
        }}
      />
    </Column>
  </Row>
);

export default () => {
  return <Layout>{component}</Layout>;
};
