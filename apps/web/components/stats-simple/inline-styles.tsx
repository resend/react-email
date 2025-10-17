import { ResponsiveColumn, ResponsiveRow } from '@responsive-email/react-email';
import { Layout } from '../_components/layout';

export const component = (
  <ResponsiveRow
    style={{ textAlign: 'left', fontVariantNumeric: 'tabular-nums' }}
  >
    <ResponsiveColumn style={{ margin: '12px', maxWidth: 'fit-content' }}>
      <p
        style={{
          margin: '0',
          fontSize: '24px',
          lineHeight: '1.625',
          fontWeight: '700',
          letterSpacing: '-0.025em',
          color: '#111827',
        }}
      >
        42
      </p>
      <p style={{ margin: '0', fontSize: '14px', color: '#6b7280' }}>
        The Answer
      </p>
    </ResponsiveColumn>
    <ResponsiveColumn style={{ margin: '12px', maxWidth: 'fit-content' }}>
      <p
        style={{
          margin: '0',
          fontSize: '24px',
          lineHeight: '1.625',
          fontWeight: '700',
          letterSpacing: '-0.025em',
          color: '#111827',
        }}
      >
        10M
      </p>
      <p style={{ margin: '0', fontSize: '14px', color: '#6b7280' }}>
        Days for Earth Mark II
      </p>
    </ResponsiveColumn>
    <ResponsiveColumn style={{ margin: '12px', maxWidth: 'fit-content' }}>
      <p
        style={{
          margin: '0',
          fontSize: '24px',
          lineHeight: '1.625',
          fontWeight: '700',
          letterSpacing: '-0.025em',
          color: '#111827',
        }}
      >
        2^276,709:1
      </p>
      <p style={{ margin: '0', fontSize: '14px', color: '#6b7280' }}>
        Improbability Drive odds
      </p>
    </ResponsiveColumn>
  </ResponsiveRow>
);

export default () => {
  return <Layout>{component}</Layout>;
};
