import { Column, Row } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Row>
    <Column align="center">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: '30px',
            lineHeight: '1.625',
            fontWeight: 'bold',
            letterSpacing: '-0.025em',
            color: '#111827',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          42
        </p>
        <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
          The Answer
        </p>
      </div>
    </Column>
    <Column align="center">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: '30px',
            lineHeight: '1.625',
            fontWeight: 'bold',
            letterSpacing: '-0.025em',
            color: '#111827',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          10M
        </p>
        <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
          Days for Earth Mark II
        </p>
      </div>
    </Column>
    <Column align="center">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: '30px',
            lineHeight: '1.625',
            fontWeight: 'bold',
            letterSpacing: '-0.025em',
            color: '#111827',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          2^276,709:1
        </p>
        <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
          Improbability Drive odds
        </p>
      </div>
    </Column>
  </Row>
);

export default () => {
  return <Layout>{component}</Layout>;
};
