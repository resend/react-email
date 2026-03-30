import { Column, Img, Row, Section } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Section
    style={{
      textAlign: 'center',
      fontSize: '14px',
      lineHeight: '20px',
      color: '#4b5563',
    }}
  >
    <p
      style={{
        margin: 0,
        fontSize: '16px',
        lineHeight: '24px',
        fontWeight: 300,
        color: '#1f2937',
      }}
    >
      Design is not just what it looks like and feels like. Design is how it
      works. The people who are crazy enough to think they can change the world
      are the ones who do. Innovation distinguishes between a leader and a
      follower.
    </p>
    <Row
      style={{
        marginTop: '32px',
      }}
      width={undefined}
      align="center"
    >
      <Column valign="middle">
        <div
          style={{
            height: '32px',
            width: '32px',
            borderRadius: '9999px',
            overflow: 'hidden',
            backgroundColor: '#4b5563',
          }}
        >
          <Img
            src="/static/steve-jobs.jpg"
            width={32}
            height={32}
            alt="Steve Jobs"
            style={{ height: '100%', width: '100%', objectFit: 'cover' }}
          />
        </div>
      </Column>
      <Column valign="middle">
        <p
          style={{
            margin: 0,
            marginLeft: '12px',
            fontSize: '14px',
            lineHeight: '20px',
            fontWeight: 600,
            color: '#111827',
            marginRight: 8,
          }}
        >
          Steve Jobs
        </p>
      </Column>
      <Column valign="middle">
        <span style={{ fontSize: '14px', lineHeight: '20px', marginRight: 8 }}>
          •
        </span>
      </Column>
      <Column valign="middle">
        <p
          style={{
            margin: 0,
            fontSize: '14px',
            lineHeight: '20px',
          }}
        >
          Co-founder of Apple
        </p>
      </Column>
    </Row>
  </Section>
);

export default () => {
  return <Layout>{component}</Layout>;
};
