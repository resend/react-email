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
import { Fragment } from 'react/jsx-runtime';

export const component = (
  <Section>
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
      ].map((author) => (
        <Fragment key={author.name}>
          <Row
            align="left"
            width="288"
            style={{ marginTop: '16px', width: '288px' }}
          >
            <Column
              width="48"
              height="48"
              style={{
                paddingTop: '5px',
                height: '48px',
                width: '48px',
                textAlign: 'left',
              }}
            >
              <Img
                alt={author.name}
                height={48}
                src={author.imgSrc}
                style={{
                  borderRadius: '9999px',
                  display: 'block',
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
                width={48}
              />
            </Column>
            <Column
              width="100%"
              style={{
                paddingLeft: '18px',
                width: '100%',
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
              <Row width={undefined} style={{ paddingTop: '8px' }} align="left">
                <Column width="12" height="12">
                  <Link
                    href="#"
                    style={{
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
                </Column>
                <Column width="12" height="12" style={{ paddingLeft: 8 }}>
                  <Link
                    href="#"
                    style={{
                      height: '12px',
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
                </Column>
              </Row>
            </Column>
          </Row>
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
        </Fragment>
      ))}
    </Section>
  </Section>
);

export default () => {
  return <Layout>{component}</Layout>;
};
