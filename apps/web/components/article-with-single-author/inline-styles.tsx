import {
  Heading,
  Hr,
  Img,
  Link,
  Row,
  Section,
  Text,
} from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Row>
    <Hr
      style={{
        borderColor: 'rgb(209,213,219) !important',
        marginTop: '16px',
        marginBottom: '16px',
      }}
    />
    <Section
      style={{
        display: 'inline-block',
        marginTop: '5px',
        maxHeight: '48px',
        maxWidth: '48px',
        textAlign: 'left',
      }}
    >
      <Img
        alt="Steve Jobs"
        height={48}
        src="/static/steve-jobs.jpg"
        style={{
          borderRadius: '9999px',
          display: 'block',
          height: '48px',
          objectFit: 'cover',
          objectPosition: 'center',
          width: '48px',
        }}
        width={48}
      />
    </Section>
    <Section
      style={{
        display: 'inline-block',
        marginLeft: '18px',
        maxWidth: '120px',
        textAlign: 'left',
        verticalAlign: 'top',
      }}
    >
      <Heading
        as="h3"
        style={{
          color: 'rgb(31,41,55)',
          fontSize: '14px',
          fontWeight: 500,
          lineHeight: '20px',
          margin: '0px',
        }}
      >
        Steve Jobs
      </Heading>
      <Text
        style={{
          color: 'rgb(107,114,128)',
          fontSize: '12px',
          fontWeight: 500,
          lineHeight: '14px',
          margin: '0px',
        }}
      >
        Co-Founder & CEO
      </Text>
      <Section
        style={{
          marginTop: '4px',
        }}
      >
        <Link
          href="#"
          style={{
            display: 'inline-flex',
            height: '12px',
            width: '12px',
          }}
        >
          <Img
            alt="X"
            src="/static/x-icon.png"
            style={{ height: '12px', width: '12px' }}
          />
        </Link>
        <Link
          href="#"
          style={{
            display: 'inline-flex',
            height: '12px',
            marginLeft: '8px',
            width: '12px',
          }}
        >
          <Img
            alt="LinkedIn"
            src="/static/in-icon.png"
            style={{ height: '12px', width: '12px' }}
          />
        </Link>
      </Section>
    </Section>
  </Row>
);

export default () => {
  return <Layout>{component}</Layout>;
};
