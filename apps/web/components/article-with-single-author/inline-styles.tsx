import {
  Column,
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
  <Section>
    <Hr
      style={{
        borderColor: 'rgb(209,213,219) !important',
        marginTop: '16px',
        marginBottom: '16px',
      }}
    />
    <Row width={undefined}>
      <Column
        width="48"
        height="48"
        style={{
          display: 'inline-block',
          paddingTop: '5px',
          height: '48px',
          width: '48px',
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
      </Column>
      <Column
        width="120"
        style={{
          paddingLeft: '18px',
          maxWidth: '120px',
        }}
        align="left"
        valign="top"
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
        <Row
          align={undefined}
          width={undefined}
          style={{
            marginTop: '4px',
          }}
        >
          <Column width={undefined} valign="middle">
            <Link
              href="#"
              style={{
                height: '12px',
                width: '12px',
              }}
            >
              <Img
                alt="X"
                src="/static/x-icon.png"
                width="12"
                height="12"
                style={{ height: '12px', width: '12px' }}
              />
            </Link>
          </Column>
          <Column
            width={undefined}
            valign="middle"
            style={{
              paddingLeft: '8px',
            }}
          >
            <Link
              href="#"
              style={{
                height: '12px',
                width: '12px',
              }}
            >
              <Img
                alt="LinkedIn"
                src="/static/in-icon.png"
                width="12"
                height="12"
                style={{ height: '12px', width: '12px' }}
              />
            </Link>
          </Column>
        </Row>
      </Column>
    </Row>
  </Section>
);

export default () => {
  return <Layout>{component}</Layout>;
};
