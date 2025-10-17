import { Img } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '32px',
      textAlign: 'center',
      fontSize: '14px',
      color: '#6b7280',
    }}
  >
    <p
      style={{
        margin: 0,
        fontSize: '16px',
        lineHeight: '1.625',
        fontWeight: 300,
        color: '#1f2937',
      }}
    >
      Design is not just what it looks like and feels like. Design is how it
      works. The people who are crazy enough to think they can change the world
      are the ones who do. Innovation distinguishes between a leader and a
      follower.
    </p>
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
      }}
    >
      <div
        style={{
          height: '32px',
          width: '32px',
          overflow: 'hidden',
          borderRadius: '100%',
          backgroundColor: '#4b5563',
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
      </div>
      <div
        style={{
          display: 'flex',
          width: 'fit-content',
          gap: '8px',
        }}
      >
        <p
          style={{
            margin: 0,
            fontWeight: 600,
            color: '#111827',
          }}
        >
          Steve Jobs
        </p>
        <span style={{ margin: 0 }}>•</span>
        <p style={{ margin: 0 }}>Co-founder of Apple</p>
      </div>
    </div>
  </div>
);

export default () => {
  return <Layout>{component}</Layout>;
};
