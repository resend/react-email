import {
  Button,
  Column,
  Heading,
  Img,
  Row,
  Section,
  Text,
} from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Section style={{ paddingTop: 16, paddingBottom: 16, textAlign: 'center' }}>
    <Heading
      as="h1"
      style={{
        fontSize: 30,
        lineHeight: '36px',
        marginBottom: '0px',
        fontWeight: 600,
      }}
    >
      You left something in your cart
    </Heading>
    <Section
      style={{
        padding: 16,
        paddingTop: '0px',
        marginTop: 16,
        marginBottom: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgb(229,231,235)',
      }}
    >
      <table style={{ marginBottom: 16 }} width="100%">
        <tr>
          <th
            style={{
              paddingTop: 8,
              paddingBottom: 8,
              borderWidth: '0px',
              borderBottomWidth: 1,
              borderStyle: 'solid',
              borderColor: 'rgb(229,231,235)',
            }}
          >
            &nbsp;
          </th>
          <th
            align="left"
            colSpan={6}
            style={{
              paddingTop: 8,
              paddingBottom: 8,
              color: 'rgb(107,114,128)',
              borderWidth: '0px',
              borderBottomWidth: 1,
              borderStyle: 'solid',
              borderColor: 'rgb(229,231,235)',
            }}
          >
            <Text style={{ fontWeight: 600 }}>Product</Text>
          </th>
          <th
            align="center"
            style={{
              paddingTop: 8,
              paddingBottom: 8,
              color: 'rgb(107,114,128)',
              borderWidth: '0px',
              borderBottomWidth: 1,
              borderStyle: 'solid',
              borderColor: 'rgb(229,231,235)',
            }}
          >
            <Text style={{ fontWeight: 600 }}>Quantity</Text>
          </th>
          <th
            align="center"
            style={{
              paddingTop: 8,
              paddingBottom: 8,
              color: 'rgb(107,114,128)',
              borderWidth: '0px',
              borderBottomWidth: 1,
              borderStyle: 'solid',
              borderColor: 'rgb(229,231,235)',
            }}
          >
            <Text style={{ fontWeight: 600 }}>Price</Text>
          </th>
        </tr>
        <tr>
          <td
            style={{
              paddingTop: 8,
              paddingBottom: 8,
              borderWidth: '0px',
              borderBottomWidth: 1,
              borderStyle: 'solid',
              borderColor: 'rgb(229,231,235)',
            }}
          >
            <Img
              alt="Braun Classic Watch"
              height={110}
              src="/static/braun-classic-watch.jpg"
              style={{
                objectFit: 'cover',
                borderRadius: 8,
              }}
            />
          </td>
          <td
            align="left"
            colSpan={6}
            style={{
              paddingTop: 8,
              paddingBottom: 8,
              borderWidth: '0px',
              borderBottomWidth: 1,
              borderStyle: 'solid',
              borderColor: 'rgb(229,231,235)',
            }}
          >
            <Text>Classic Watch</Text>
          </td>
          <td
            align="center"
            style={{
              paddingTop: 8,
              paddingBottom: 8,
              borderWidth: '0px',
              borderBottomWidth: 1,
              borderStyle: 'solid',
              borderColor: 'rgb(229,231,235)',
            }}
          >
            <Text>1</Text>
          </td>
          <td
            align="center"
            style={{
              paddingTop: 8,
              paddingBottom: 8,
              borderWidth: '0px',
              borderBottomWidth: 1,
              borderStyle: 'solid',
              borderColor: 'rgb(229,231,235)',
            }}
          >
            <Text>$210.00</Text>
          </td>
        </tr>
        <tr>
          <td
            style={{
              paddingTop: 8,
              paddingBottom: 8,
              borderWidth: '0px',
              borderBottomWidth: 1,
              borderStyle: 'solid',
              borderColor: 'rgb(229,231,235)',
            }}
          >
            <Img
              alt="Braun Analogue Clock"
              height={110}
              src="/static/braun-analogue-clock.jpg"
              style={{
                objectFit: 'cover',
                borderRadius: 8,
              }}
            />
          </td>
          <td
            align="left"
            colSpan={6}
            style={{
              paddingTop: 8,
              paddingBottom: 8,
              borderWidth: '0px',
              borderBottomWidth: 1,
              borderStyle: 'solid',
              borderColor: 'rgb(229,231,235)',
            }}
          >
            <Text>Analogue Clock</Text>
          </td>
          <td
            align="center"
            style={{
              paddingTop: 8,
              paddingBottom: 8,
              borderWidth: '0px',
              borderBottomWidth: 1,
              borderStyle: 'solid',
              borderColor: 'rgb(229,231,235)',
            }}
          >
            <Text>1</Text>
          </td>
          <td
            align="center"
            style={{
              paddingTop: 8,
              paddingBottom: 8,
              borderWidth: '0px',
              borderBottomWidth: 1,
              borderStyle: 'solid',
              borderColor: 'rgb(229,231,235)',
            }}
          >
            <Text>$40.00</Text>
          </td>
        </tr>
      </table>
      <Row>
        <Column align="center">
          <Button
            href="https://react.email"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              paddingLeft: 12,
              paddingRight: 12,
              borderRadius: 8,
              textAlign: 'center',
              backgroundColor: 'rgb(79,70,229)',
              paddingTop: 12,
              paddingBottom: 12,
              fontWeight: 600,
              color: 'rgb(255,255,255)',
            }}
          >
            Checkout
          </Button>
        </Column>
      </Row>
    </Section>
  </Section>
);

export default () => {
  return <Layout>{component}</Layout>;
};
