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
        marginBottom: '0px',
      }}
    />
    <Section>
      {[
        {
          name: 'Steve Jobs',
          title: 'Co-Founder & CEO',
          imgSrc: '/static/steve-jobs.jpg',
          showDivider: true,
        },
        {
          name: 'Steve Wozniak',
          title: 'Co-Founder & CTO',
          imgSrc: '/static/steve-wozniak.jpg',
          showDivider: false,
        },
      ].map((author, index) => (
        <>
          <Section
            align="left"
            key={index}
            style={{ marginTop: '16px', maxWidth: '288px' }}
          >
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
                alt={author.name}
                height={48}
                src={author.imgSrc}
                style={{
                  borderRadius: 9999,
                  display: 'block',
                  objectFit: 'cover',
                  objectPosition: 'center',
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
                  color: 'rgb(17,24,39)',
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '20px',
                  margin: '0px',
                }}
              >
                {author.name}
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
                {author.title}
              </Text>
              <Section style={{ marginTop: '4px' }}>
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
                    height={12}
                    src="/static/x-icon.png"
                    width={12}
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
                    height={12}
                    src="/static/in-icon.png"
                    width={12}
                  />
                </Link>
              </Section>
            </Section>
          </Section>
          {author.showDivider ? (
            <Hr
              style={{
                border: 'none',
                backgroundColor: 'rgb(209,213,219)',
                display: 'inline-block',
                float: 'left',
                height: '58px',
                marginRight: '16px',
                width: '1px',
              }}
            />
          ) : null}
        </>
      ))}
    </Section>
  </Row>
);

export default () => {
  return <Layout>{component}</Layout>;
};
