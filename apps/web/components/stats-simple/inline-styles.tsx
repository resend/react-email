import { ResponsiveColumn, ResponsiveRow } from '@responsive-email/react-email';
import { Layout } from '../_components/layout';

export const component = (
  <ResponsiveRow>
    <ResponsiveColumn>
      <p
        style={{
          margin: 0,
          textAlign: 'left',
          fontSize: '18px',
          lineHeight: '24px',
          fontWeight: 700,
          letterSpacing: '-0.025em',
          color: '#111827',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        42
      </p>
      <p
        style={{
          margin: 0,
          textAlign: 'left',
          fontSize: '12px',
          lineHeight: '18px',
          color: '#6b7280',
        }}
      >
        The Answer
      </p>
    </ResponsiveColumn>
    <ResponsiveColumn>
      <p
        style={{
          margin: 0,
          textAlign: 'left',
          fontSize: '18px',
          lineHeight: '24px',
          fontWeight: 700,
          letterSpacing: '-0.025em',
          color: '#111827',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        10M
      </p>
      <p
        style={{
          margin: 0,
          textAlign: 'left',
          fontSize: '12px',
          lineHeight: '18px',
          color: '#6b7280',
        }}
      >
        Days for Earth Mark II
      </p>
    </ResponsiveColumn>
    <ResponsiveColumn>
      <p
        style={{
          margin: 0,
          textAlign: 'left',
          fontSize: '18px',
          lineHeight: '24px',
          fontWeight: 700,
          letterSpacing: '-0.025em',
          color: '#111827',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        2^276,709:1
      </p>
      <p
        style={{
          margin: 0,
          textAlign: 'left',
          fontSize: '12px',
          lineHeight: '18px',
          color: '#6b7280',
        }}
      >
        Improbability Drive odds
      </p>
    </ResponsiveColumn>
  </ResponsiveRow>
);

export default () => {
  return <Layout>{component}</Layout>;
};
