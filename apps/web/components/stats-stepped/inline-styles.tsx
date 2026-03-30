import { Column, Row, Section } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Section>
    <Row style={{ marginBottom: '8px' }}>
      <Column
        style={{
          minHeight: '112px',
          borderRadius: '16px',
          backgroundColor: '#f3f4f6',
          padding: '16px',
        }}
      >
        <p
          style={{
            marginBottom: '0',
            fontSize: '24px',
            lineHeight: '32px',
            fontWeight: 'bold',
            letterSpacing: '-0.025em',
            fontVariantNumeric: 'tabular-nums',
            color: '#111827',
          }}
        >
          42
        </p>
        <div style={{ color: '#374151' }}>
          <p
            style={{ marginBottom: '0', fontSize: '15px', lineHeight: '22px' }}
          >
            The Answer
          </p>
          <p
            style={{
              marginBottom: '0',
              marginTop: '4px',
              fontSize: '13px',
              lineHeight: '18px',
              color: '#4b5563',
            }}
          >
            To life, the universe, and everything computed by Deep Thought.
          </p>
        </div>
      </Column>
    </Row>
    <Row style={{ marginBottom: '8px' }}>
      <Column
        style={{
          minHeight: '192px',
          borderRadius: '16px',
          backgroundColor: '#111827',
          padding: '16px',
        }}
      >
        <p
          style={{
            marginBottom: '0',
            fontSize: '24px',
            lineHeight: '32px',
            fontWeight: 'bold',
            letterSpacing: '-0.025em',
            fontVariantNumeric: 'tabular-nums',
            color: '#f9fafb',
          }}
        >
          10M
        </p>
        <div style={{ color: '#d1d5db' }}>
          <p
            style={{ marginBottom: '0', fontSize: '15px', lineHeight: '22px' }}
          >
            Years for Earth Mark II
          </p>
          <p
            style={{
              marginBottom: '0',
              marginTop: '4px',
              fontSize: '13px',
              lineHeight: '18px',
              color: '#9ca3af',
            }}
          >
            Time required by Magrathea to build a replacement Earth.
          </p>
        </div>
      </Column>
    </Row>
    <Row>
      <Column
        style={{
          minHeight: '128px',
          borderRadius: '16px',
          backgroundColor: '#4338ca',
          padding: '16px',
        }}
      >
        <p
          style={{
            marginBottom: '0',
            fontSize: '24px',
            lineHeight: '32px',
            fontWeight: 'bold',
            letterSpacing: '-0.025em',
            fontVariantNumeric: 'tabular-nums',
            color: '#eef2ff',
          }}
        >
          2^276,709:1
        </p>
        <div style={{ color: '#e0e7ff' }}>
          <p
            style={{ marginBottom: '0', fontSize: '15px', lineHeight: '22px' }}
          >
            Improbability Drive odds
          </p>
          <p
            style={{
              marginBottom: '0',
              marginTop: '4px',
              fontSize: '13px',
              lineHeight: '18px',
              color: '#c7d2fe',
            }}
          >
            Chances against successfully activating the infinite improbability
            drive.
          </p>
        </div>
      </Column>
    </Row>
  </Section>
);

export default () => {
  return <Layout>{component}</Layout>;
};
