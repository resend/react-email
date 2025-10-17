import { Img } from '@react-email/components';
import { ResponsiveColumn, ResponsiveRow } from '@responsive-email/react-email';
import { Layout } from '../_components/layout';

export const component = (
  <ResponsiveRow
    style={{
      margin: '12px',
      textAlign: 'left',
      fontSize: '14px',
      color: '#6b7280',
    }}
  >
    <ResponsiveColumn
      style={{
        margin: '0 24px 24px 0',
        width: '256px',
        overflow: 'hidden',
        borderRadius: '24px',
      }}
    >
      <Img
        src="/static/steve-jobs.jpg"
        width={320}
        height={320}
        alt="Steve Jobs"
        style={{
          height: '100%',
          width: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />
    </ResponsiveColumn>
    <ResponsiveColumn>
      <p
        style={{
          margin: '0 0 24px 0',
          fontSize: '16px',
          lineHeight: '1.625',
          fontWeight: '300',
          color: '#1f2937',
        }}
      >
        Design is not just what it looks like and feels like. Design is how it
        works. The people who are crazy enough to think they can change the
        world are the ones who do. Innovation distinguishes between a leader and
        a follower.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <p
          style={{
            margin: '0',
            fontSize: '16px',
            fontWeight: '600',
            color: '#111827',
          }}
        >
          Steve Jobs
        </p>
        <p style={{ margin: '0' }}>Co-founder of Apple</p>
      </div>
    </ResponsiveColumn>
  </ResponsiveRow>
);

export default () => {
  return <Layout>{component}</Layout>;
};
