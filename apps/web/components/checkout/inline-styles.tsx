import {
  Button,
  Column,
  Heading,
  Img,
  Row,
  Section,
  Text,
} from "@react-email/components";
import { Layout } from "../_components/layout";

export const component =  (
  <Section style={{ paddingTop: 16, paddingBottom: 16, textAlign: "center" }}>
    <Heading
      as="h1"
      style={{
        fontSize: 30,
        lineHeight: "36px",
        marginBottom: 0,
        fontWeight: 600,
      }}
    >
      You left something in your cart 👀
    </Heading>
    <Section
      style={{
        padding: 16,
        paddingTop: 0,
        marginTop: 16,
        marginBottom: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "rgb(229,231,235)",
      }}
    >
      <table style={{ marginBottom: 16 }} width="100%">
        <tr>
          <th
            style={{
              paddingTop: 8,
              paddingBottom: 8,
              borderWidth: 0,
              borderBottomWidth: 1,
              borderStyle: "solid",
              borderColor: "rgb(229,231,235)",
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
              color: "rgb(107,114,128)",
              borderWidth: 0,
              borderBottomWidth: 1,
              borderStyle: "solid",
              borderColor: "rgb(229,231,235)",
            }}
          >
            <Text style={{ fontWeight: 600 }}>Product</Text>
          </th>
          <th
            align="center"
            style={{
              paddingTop: 8,
              paddingBottom: 8,
              color: "rgb(107,114,128)",
              borderWidth: 0,
              borderBottomWidth: 1,
              borderStyle: "solid",
              borderColor: "rgb(229,231,235)",
            }}
          >
            <Text style={{ fontWeight: 600 }}>Quantity</Text>
          </th>
          <th
            align="center"
            style={{
              paddingTop: 8,
              paddingBottom: 8,
              color: "rgb(107,114,128)",
              borderWidth: 0,
              borderBottomWidth: 1,
              borderStyle: "solid",
              borderColor: "rgb(229,231,235)",
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
              borderWidth: 0,
              borderBottomWidth: 1,
              borderStyle: "solid",
              borderColor: "rgb(229,231,235)",
            }}
          >
            <Img
              alt="A picture of various Apple products laid out on a table. There is an Apple Watch with its box bellow it, there is a MacBook Pro with its box bellow it, there is an Iphone with some box bellow it, there is an Apple Keyboard, and some other items that can't quite be recognized from the picture"
              height={110}
              src="https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=2864&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              style={{
                objectFit: "cover",
                borderRadius: 8,
                width: "75%",
              }}
            />
          </td>
          <td
            align="left"
            colSpan={6}
            style={{
              paddingTop: 8,
              paddingBottom: 8,
              borderWidth: 0,
              borderBottomWidth: 1,
              borderStyle: "solid",
              borderColor: "rgb(229,231,235)",
            }}
          >
            <Text>Apple Watch</Text>
          </td>
          <td
            align="center"
            style={{
              paddingTop: 8,
              paddingBottom: 8,
              borderWidth: 0,
              borderBottomWidth: 1,
              borderStyle: "solid",
              borderColor: "rgb(229,231,235)",
            }}
          >
            <Text>1</Text>
          </td>
          <td
            align="center"
            style={{
              paddingTop: 8,
              paddingBottom: 8,
              borderWidth: 0,
              borderBottomWidth: 1,
              borderStyle: "solid",
              borderColor: "rgb(229,231,235)",
            }}
          >
            <Text>$999.99</Text>
          </td>
        </tr>
        <tr>
          <td
            style={{
              paddingTop: 8,
              paddingBottom: 8,
              borderWidth: 0,
              borderBottomWidth: 1,
              borderStyle: "solid",
              borderColor: "rgb(229,231,235)",
            }}
          >
            <Img
              alt="A picture of a very nice looking product in a bottle. The bottle has a black tap and it looks like it is brown overall. The product is sitting in front of a bage wall and on top of some wooden round board"
              height={110}
              src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              style={{
                objectFit: "cover",
                borderRadius: 8,
                width: "75%",
              }}
            />
          </td>
          <td
            align="left"
            colSpan={6}
            style={{
              paddingTop: 8,
              paddingBottom: 8,
              borderWidth: 0,
              borderBottomWidth: 1,
              borderStyle: "solid",
              borderColor: "rgb(229,231,235)",
            }}
          >
            <Text>Nice Fragrance</Text>
          </td>
          <td
            align="center"
            style={{
              paddingTop: 8,
              paddingBottom: 8,
              borderWidth: 0,
              borderBottomWidth: 1,
              borderStyle: "solid",
              borderColor: "rgb(229,231,235)",
            }}
          >
            <Text>1</Text>
          </td>
          <td
            align="center"
            style={{
              paddingTop: 8,
              paddingBottom: 8,
              borderWidth: 0,
              borderBottomWidth: 1,
              borderStyle: "solid",
              borderColor: "rgb(229,231,235)",
            }}
          >
            <Text>$99.99</Text>
          </td>
        </tr>
      </table>
      <Row>
        <Column align="center">
          <Button
            href="https://react.email"
            style={{
              width: "100%",
              boxSizing: "border-box",
              paddingLeft: 12,
              paddingRight: 12,
              borderRadius: 8,
              textAlign: "center",
              backgroundColor: "rgb(79,70,229)",
              paddingTop: 12,
              paddingBottom: 12,
              fontWeight: 600,
              color: "rgb(255,255,255)",
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
  return (
    <Layout>
      {component}
    </Layout>
  );
};
