import { Column, Row } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Row style={{ fontSize: '30px', fontWeight: 500, color: '#111827' }}>
    <Column align="center">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p
          style={{
            fontFamily: 'monospace',
            lineHeight: 1.625,
            fontWeight: 700,
            fontVariantNumeric: 'tabular-nums',
            margin: 0,
            width: 'fit-content',
          }}
        >
          42
        </p>
        <p
          style={{
            fontSize: '12px',
            color: '#6b7280',
            margin: 0,
            width: 'fit-content',
          }}
        >
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
          justifyContent: 'center',
        }}
      >
        <p
          style={{
            fontFamily: 'monospace',
            lineHeight: 1.625,
            fontWeight: 700,
            fontVariantNumeric: 'tabular-nums',
            margin: 0,
            width: 'fit-content',
          }}
        >
          10M
        </p>
        <p
          style={{
            fontSize: '12px',
            color: '#6b7280',
            margin: 0,
            width: 'fit-content',
          }}
        >
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
          justifyContent: 'center',
        }}
      >
        <p
          style={{
            fontFamily: 'monospace',
            lineHeight: 1.625,
            fontWeight: 700,
            fontVariantNumeric: 'tabular-nums',
            margin: 0,
            width: 'fit-content',
          }}
        >
          2^276,709:1
        </p>
        <p
          style={{
            fontSize: '12px',
            color: '#6b7280',
            margin: 0,
            width: 'fit-content',
          }}
        >
          Improbability Drive odds
        </p>
      </div>
    </Column>
  </Row>
);

export default () => {
  return <Layout>{component}</Layout>;
};
