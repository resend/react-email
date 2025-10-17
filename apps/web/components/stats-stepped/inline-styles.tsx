import { Row, Section } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Section
    style={{
      fontSize: '18px',
      fontWeight: '500',
      color: '#111827',
    }}
  >
    <Row style={{ marginBottom: '8px' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          flexShrink: 1,
          flexBasis: '0%',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            minHeight: '112px',
            borderRadius: '16px',
            backgroundColor: '#f9fafb',
            padding: '24px',
          }}
        >
          <p
            style={{
              marginTop: '0',
              marginBottom: 'auto',
              marginLeft: '0',
              marginRight: '0',
              fontSize: '30px',
              fontWeight: '700',
              letterSpacing: '-0.025em',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            42
          </p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <p style={{ margin: '0' }}>The Answer</p>
            <p
              style={{
                margin: '0',
                fontSize: '14px',
                color: '#4b5563',
              }}
            >
              To life, the universe, and everything computed by Deep Thought.
            </p>
          </div>
        </div>
      </div>
    </Row>
    <Row style={{ marginBottom: '8px' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          flexShrink: 1,
          flexBasis: '0%',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            minHeight: '192px',
            borderRadius: '16px',
            backgroundColor: '#111827',
            padding: '24px',
            color: '#ffffff',
          }}
        >
          <p
            style={{
              marginTop: '0',
              marginBottom: 'auto',
              marginLeft: '0',
              marginRight: '0',
              fontSize: '30px',
              fontWeight: '700',
              letterSpacing: '-0.025em',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            10M
          </p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <p style={{ margin: '0' }}>Years for Earth Mark II</p>
            <p
              style={{
                margin: '0',
                fontSize: '14px',
                color: '#9ca3af',
              }}
            >
              Time required by Magrathea to build a replacement Earth.
            </p>
          </div>
        </div>
      </div>
    </Row>
    <Row>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          flexShrink: 1,
          flexBasis: '0%',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            minHeight: '128px',
            borderRadius: '16px',
            backgroundColor: '#4f46e5',
            padding: '24px',
            color: '#ffffff',
          }}
        >
          <p
            style={{
              marginTop: '0',
              marginBottom: 'auto',
              marginLeft: '0',
              marginRight: '0',
              fontSize: '30px',
              fontWeight: '700',
              letterSpacing: '-0.025em',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            2^276,709:1
          </p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <p style={{ margin: '0' }}>Improbability Drive odds</p>
            <p
              style={{
                margin: '0',
                fontSize: '14px',
                color: '#c7d2fe',
              }}
            >
              Chances against successfully activating the infinite improbability
              drive.
            </p>
          </div>
        </div>
      </div>
    </Row>
  </Section>
);

export default () => {
  return <Layout>{component}</Layout>;
};
