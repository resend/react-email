import { Button, Img, Section, Text } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Section style={{ marginTop: 16, marginBottom: 16 }}>
    <table style={{ width: '100%' }}>
      <tbody style={{ width: '100%' }}>
        <tr style={{ width: '100%' }}>
          <td
            style={{
              width: '50%',
              paddingRight: 32,
              boxSizing: 'border-box',
            }}
          >
            <Img
              alt="Braun Vintage"
              height={220}
              src="/static/braun-vintage.jpg"
              style={{
                borderRadius: 8,
                width: '100%',
                objectFit: 'cover',
              }}
            />
          </td>
          <td style={{ width: '50%', verticalAlign: 'baseline' }}>
            <Text
              style={{
                margin: '0px',
                marginTop: 8,
                fontSize: 20,
                lineHeight: '28px',
                fontWeight: 600,
                color: 'rgb(17,24,39)',
              }}
            >
              Great Timepiece
            </Text>
            <Text
              style={{
                marginTop: 8,
                fontSize: 16,
                lineHeight: '24px',
                color: 'rgb(107,114,128)',
              }}
            >
              Renowned for their minimalist design and high functionality,
              celebrating the principles of simplicity and clarity.
            </Text>
            <Text
              style={{
                marginTop: 8,
                fontSize: 18,
                lineHeight: '28px',
                fontWeight: 600,
                color: 'rgb(17,24,39)',
              }}
            >
              $120.00
            </Text>
            <Button
              href="https://react.email"
              style={{
                width: '75%',
                borderRadius: 8,
                backgroundColor: 'rgb(79,70,229)',
                paddingTop: 12,
                paddingBottom: 12,
                paddingLeft: 16,
                paddingRight: 16,
                textAlign: 'center',
                fontWeight: 600,
                color: 'rgb(255,255,255)',
              }}
            >
              Buy
            </Button>
          </td>
        </tr>
      </tbody>
    </table>
  </Section>
);

export default () => {
  return <Layout>{component}</Layout>;
};
