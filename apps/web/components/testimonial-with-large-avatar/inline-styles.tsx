import { Img } from '@react-email/components';
import { ResponsiveColumn, ResponsiveRow } from '@responsive-email/react-email';
import { Layout } from '../_components/layout';

export const component = (
  <ResponsiveRow
    style={{
      marginLeft: '12px',
      marginRight: '12px',
      marginTop: '16px',
      marginBottom: '16px',
      fontSize: '14px',
      color: '#4b5563',
    }}
  >
    <ResponsiveColumn
      style={{
        marginTop: '0',
        marginRight: '24px',
        marginBottom: '24px',
        marginLeft: '0',
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
          height: '320px',
          width: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />
    </ResponsiveColumn>
    <ResponsiveColumn style={{ paddingRight: '24px' }}>
      <p
        style={{
          marginLeft: '0',
          marginRight: '0',
          marginTop: '0',
          marginBottom: '24px',
          textAlign: 'left',
          fontSize: '16px',
          lineHeight: '1.625',
          fontWeight: '300',
          color: '#374151',
        }}
      >
        Design is not just what it looks like and feels like. Design is how it
        works. The people who are crazy enough to think they can change the
        world are the ones who do. Innovation distinguishes between a leader and
        a follower.
      </p>
      <p
        style={{
          marginLeft: '0',
          marginRight: '0',
          marginTop: '0',
          marginBottom: '4px',
          textAlign: 'left',
          fontSize: '16px',
          fontWeight: '600',
          color: '#1f2937',
        }}
      >
        Steve Jobs
      </p>
      <p
        style={{
          margin: '0',
          textAlign: 'left',
          fontSize: '14px',
          color: '#4b5563',
        }}
      >
        Co-founder of Apple
      </p>
    </ResponsiveColumn>
  </ResponsiveRow>
);

export default () => {
  return <Layout>{component}</Layout>;
};
