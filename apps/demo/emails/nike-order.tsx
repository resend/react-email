import { Container } from '@react-email/container';
import { Head } from '@react-email/head';
import { Heading } from '@react-email/heading';
import { Hr } from '@react-email/hr';
import { Html } from '@react-email/html';
import { Img } from '@react-email/img';
import { Link } from '@react-email/link';
import { Preview } from '@react-email/preview';
import { Section } from '@react-email/section';
import { Text } from '@react-email/text';
import * as React from 'react';

export default function Email() {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : '';

  return (
    <Html>
      <Head />
      <Preview>Nike</Preview>
      <Section style={main}>
        <Container style={container}>
          <Container style={track.container}>
            <Container style={{ float: 'left' }}>
              <Text style={global.paragraphWithBold}>Tracking Number</Text>
              <Text style={track.number}>1ZV218970300071628</Text>
            </Container>
            <Container style={{ float: 'right', marginTop: '3px' }}>
              <Link style={global.button}>Track Package</Link>
            </Container>
            <Container style={{ clear: 'both' }} />
          </Container>
          <Hr style={global.hr} />
          <Container style={message}>
            <Img
              src={`${baseUrl}/static/nike-logo.png`}
              width="66"
              height="22"
              alt="Nike"
              style={{ margin: 'auto' }}
            />
            <Heading style={global.heading}>It's On Its Way.</Heading>
            <Text style={global.text}>
              You order's is on its way. Use the link above to track its
              progress.
            </Text>
            <Text style={{ ...global.text, marginTop: 24 }}>
              We´ve also charged your payment method for the cost of your order
              and will be removing any authorization holds. For payment details,
              please visit your Orders page on Nike.com or in the Nike app.
            </Text>
          </Container>
          <Hr style={global.hr} />
          <Container style={global.defaultPadding}>
            <Text style={adressTitle}>Shipping to: Zeno Rocha</Text>
            <Text style={{ ...global.text, fontSize: 14 }}>
              185 Royal Way, Upland, CA 91786-6798
            </Text>
          </Container>
          <Hr style={global.hr} />
          <Container
            style={{ ...paddingX, paddingTop: '40px', paddingBottom: '40px' }}
          >
            <Img
              src={`${baseUrl}/static/nike-product.png`}
              alt="Brazil 2022/23 Stadium Away Women's Nike Dri-FIT Soccer Jersey"
              style={{ float: 'left' }}
              width="260px"
            />
            <Container style={{ float: 'right', width: '247px' }}>
              <Text style={{ ...paragraph, fontWeight: '500' }}>
                Brazil 2022/23 Stadium Away Women's Nike Dri-FIT Soccer Jersey
              </Text>
              <Text style={global.text}>Size L (12–14)</Text>
            </Container>
            <Container style={{ clear: 'both' }} />
          </Container>
          <Hr style={global.hr} />
          <Container style={global.defaultPadding}>
            <Container style={{ display: 'inline-flex', marginBottom: 40 }}>
              <Container style={{ width: '170px' }}>
                <Text style={global.paragraphWithBold}>Order Number</Text>
                <Text style={track.number}>C0106373851</Text>
              </Container>
              <Container>
                <Text style={global.paragraphWithBold}>Order Date</Text>
                <Text style={track.number}>Sep 22, 2022</Text>
              </Container>
            </Container>
            <Container style={{ display: 'flex', justifyContent: 'center' }}>
              <Link style={global.button}>Order Status</Link>
            </Container>
          </Container>
          <Hr style={global.hr} />
          <Container style={paddingY}>
            <Text style={global.heading}>Top Picks For You</Text>
            <Container style={recomendations.container}>
              <Container style={recomendations.product}>
                <Img
                  src={`${baseUrl}/static/nike-recomendation-1.png`}
                  alt="Brazil 2022/23 Stadium Away Women's Nike Dri-FIT Soccer Jersey"
                  width="140px"
                />
                <Text style={recomendations.title}>
                  USWNT 2022/23 Stadium Home
                </Text>
                <Text style={recomendations.text}>
                  Women's Nike Dri-FIT Soccer Jersey
                </Text>
              </Container>
              <Container style={recomendations.product}>
                <Img
                  src={`${baseUrl}/static/nike-recomendation-2.png`}
                  alt="Brazil 2022/23 Stadium Away Women's Nike Dri-FIT Soccer Jersey"
                  width="140px"
                />
                <Text style={recomendations.title}>
                  Brazil 2022/23 Stadium Goalkeeper
                </Text>
                <Text style={recomendations.text}>
                  Men's Nike Dri-FIT Short-Sleeve Football Shirt
                </Text>
              </Container>
              <Container style={recomendations.product}>
                <Img
                  src={`${baseUrl}/static/nike-recomendation-3.png`}
                  alt="Brazil 2022/23 Stadium Away Women's Nike Dri-FIT Soccer Jersey"
                  width="140px"
                  height="175px"
                  style={{ objectFit: 'cover' }}
                />
                <Text style={recomendations.title}>FFF</Text>
                <Text style={recomendations.text}>Women's Soccer Jacket</Text>
              </Container>
              <Container style={recomendations.product}>
                <Img
                  src={`${baseUrl}/static/nike-recomendation-4.png`}
                  alt="Brazil 2022/23 Stadium Away Women's Nike Dri-FIT Soccer Jersey"
                  width="140px"
                />
                <Text style={recomendations.title}>FFF</Text>
                <Text style={recomendations.text}>
                  Women's Nike Pre-Match Football Top
                </Text>
              </Container>
            </Container>
          </Container>
          <Hr style={global.hr} />
          <Container style={menu.container}>
            <Text style={menu.title}>Get Help</Text>
            <Container style={menu.content}>
              <Text style={menu.text}>Shipping Status</Text>
              <Text style={menu.text}>Shipping & Delivery</Text>
              <Text style={menu.text}>Returns & Exchanges</Text>
              <Text style={menu.text}>How to Return</Text>
              <Text style={menu.text}>Contact Options</Text>
            </Container>
            <Hr style={global.hr} />
            <Container style={menu.tel}>
              <Container style={{ display: 'inline-flex' }}>
                <Img
                  src={`${baseUrl}/static/nike-phone.png`}
                  width="16px"
                  height="26px"
                  style={{ paddingRight: '14px' }}
                />
                <Text style={menu.text}>1-800-806-6453</Text>
              </Container>
              <Text style={{ ...menu.text, width: 220, textAlign: 'center' }}>
                4 am - 11 pm PT
              </Text>
            </Container>
          </Container>
          <Hr style={global.hr} />
          <Container style={paddingY}>
            <Text style={global.heading}>Nike.com</Text>
            <Container style={categories.container}>
              <Text style={categories.text}>Men</Text>
              <Text style={categories.text}>Women</Text>
              <Text style={categories.text}>Kids</Text>
              <Text style={categories.text}>Customize</Text>
            </Container>
          </Container>
          <Hr style={{ ...global.hr, marginTop: '12px' }} />
          <Container style={paddingY}>
            <Container style={footer.policy}>
              <Text style={footer.text}>Web Version</Text>
              <Text style={footer.text}>Privacy Policy</Text>
            </Container>
            <Text style={{ ...footer.text, paddingTop: 30, paddingBottom: 30 }}>
              Please contact us if you have any questions. (If you reply to this
              email, we won't be able to see it.)
            </Text>
            <Text style={footer.text}>
              © 2022 Nike, Inc. All Rights Reserved.
            </Text>
            <Text style={footer.text}>
              NIKE, INC. One Bowerman Drive, Beaverton, Oregon 97005, USA.
            </Text>
          </Container>
        </Container>
      </Section>
    </Html>
  );
}

const fontFamily =
  '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif';

const paddingX = {
  paddingLeft: '40px',
  paddingRight: '40px',
};

const paddingY = {
  paddingTop: '22px',
  paddingBottom: '22px',
};

const paragraph = {
  fontFamily,
  margin: '0',
  lineHeight: '2',
};

const global = {
  paddingX,
  paddingY,
  defaultPadding: {
    ...paddingX,
    ...paddingY,
  },
  paragraphWithBold: { ...paragraph, fontWeight: 'bold' },
  heading: {
    fontFamily,
    fontSize: '32px',
    lineHeight: '1.3',
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: '-1px',
  } as React.CSSProperties,
  text: {
    ...paragraph,
    color: '#747474',
    fontWeight: '500',
  },
  button: {
    fontFamily,
    border: '1px solid #929292',
    fontSize: '16px',
    textDecoration: 'none',
    padding: '10px 0px',
    width: '220px',
    display: 'block',
    textAlign: 'center',
    fontWeight: 500,
    color: '#000',
  } as React.CSSProperties,
  hr: {
    borderColor: '#E5E5E5',
    margin: '0',
  },
};

const main = {
  backgroundColor: '#ffffff',
};

const container = {
  fontFamily,
  margin: '10px auto',
  width: '600px',
  border: '1px solid #E5E5E5',
};

const track = {
  container: {
    padding: '22px 40px',
    backgroundColor: '#F7F7F7',
  },
  number: {
    margin: '12px 0 0 0',
    fontWeight: 500,
    lineHeight: '1.4',
    color: '#6F6F6F',
  },
};

const message = {
  padding: '40px 74px',
  textAlign: 'center',
} as React.CSSProperties;

const adressTitle = {
  ...paragraph,
  fontSize: '15px',
  fontWeight: 'bold',
};

const recomendationsText = {
  fontFamily,
  margin: '0',
  fontSize: '15px',
  lineHeight: '1',
  paddingLeft: '10px',
  paddingRight: '10px',
};

const recomendations = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '20px 5px',
  },
  product: {
    width: '140px',
  },
  title: { ...recomendationsText, paddingTop: '12px', fontWeight: '500' },
  text: {
    ...recomendationsText,
    paddingTop: '4px',
    color: '#747474',
  },
};

const menu = {
  container: {
    paddingLeft: '20px',
    paddingRight: '20px',
    paddingTop: '20px',
    backgroundColor: '#F7F7F7',
  },
  content: {
    ...paddingY,
    paddingLeft: '20px',
    paddingRight: '20px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
  },
  title: {
    paddingLeft: '20px',
    paddingRight: '20px',
    fontWeight: 'bold',
  },
  text: {
    fontSize: '13.5px',
    marginTop: 0,
    fontWeight: 500,
  },
  tel: {
    display: 'flex',
    paddingLeft: '20px',
    paddingRight: '20px',
    paddingTop: '32px',
    paddingBottom: '22px',
  },
};

const categories = {
  container: {
    display: 'flex',
    width: '370px',
    margin: 'auto',
    justifyContent: 'space-between',
  },
  text: {
    fontWeight: '500',
  },
};

const footer = {
  policy: {
    display: 'flex',
    width: '166px',
    margin: 'auto',
    justifyContent: 'space-between',
  },
  text: {
    margin: '0',
    color: '#AFAFAF',
    fontSize: '13px',
    textAlign: 'center',
  } as React.CSSProperties,
};
