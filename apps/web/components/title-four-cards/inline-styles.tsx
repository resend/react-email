import {
  Button,
  Row,
  Column,
  Img,
  Section,
  Text,
  Hr,
} from "@react-email/components";
import { Layout } from "../_components/layout";

export const component =  (
  <Section style={{ marginTop: 16, marginBottom: 16 }}>
    <Section>
      <Row>
        <Text
          style={{
            margin: 0,
            fontSize: 20,
            lineHeight: "28px",
            fontWeight: 600,
            color: "rgb(17,24,39)",
          }}
        >
          Unleash Creativity
        </Text>
        <Text
          style={{
            marginTop: 8,
            fontSize: 16,
            lineHeight: "24px",
            color: "rgb(107,114,128)",
          }}
        >
          Unleash your inner designer with our customizable furniture options,
          allowing you to create a space that reflects your unique vision
        </Text>
      </Row>
      <Row style={{ marginTop: 16 }}>
        <Column
          align="left"
          colSpan={1}
          style={{ width: "50%", paddingRight: 8 }}
        >
          <Img
            alt="A picture of a pink background with varios items laid out. Shoes, lipstick, sunglasses, some leafs and part of a purse."
            height={180}
            src="https://images.unsplash.com/photo-1511556820780-d912e42b4980?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            style={{
              width: "100%",
              borderRadius: 8,
              objectFit: "cover",
            }}
          />
          <Text
            style={{
              margin: 0,
              marginTop: 24,
              fontSize: 20,
              lineHeight: "28px",
              color: "rgb(17,24,39)",
            }}
          >
            Sleek study
          </Text>
          <Text
            style={{
              margin: 0,
              marginTop: 16,
              fontSize: 16,
              lineHeight: "24px",
              color: "rgb(107,114,128)",
            }}
          >
            Minimalist design with ample workspace
          </Text>
          <Text
            style={{
              margin: 0,
              marginTop: 8,
              fontSize: 16,
              lineHeight: "24px",
              fontWeight: 600,
              color: "rgb(17,24,39)",
            }}
          >
            $999.99
          </Text>
          <Button
            href="https://react.email"
            style={{
              marginTop: 16,
              borderRadius: 8,
              backgroundColor: "rgb(79,70,229)",
              paddingLeft: 24,
              paddingRight: 24,
              paddingTop: 12,
              paddingBottom: 12,
              fontWeight: 600,
              color: "rgb(255,255,255)",
            }}
          >
            Buy
          </Button>
        </Column>
        <Column
          align="left"
          colSpan={1}
          style={{ width: "50%", paddingLeft: 8 }}
        >
          <Img
            alt="A picture of a two shampoos beside a box. All of them have text on them that reads 'Cureology'."
            height={180}
            src="https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=2789&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            style={{
              width: "100%",
              borderRadius: 8,
              objectFit: "cover",
            }}
          />
          <Text
            style={{
              margin: 0,
              marginTop: 24,
              fontSize: 20,
              lineHeight: "28px",
              fontWeight: 600,
              color: "rgb(17,24,39)",
            }}
          >
            Sleek study
          </Text>
          <Text
            style={{
              margin: 0,
              marginTop: 16,
              fontSize: 16,
              lineHeight: "24px",
              color: "rgb(107,114,128)",
            }}
          >
            Minimalist design with ample workspace
          </Text>
          <Text
            style={{
              margin: 0,
              marginTop: 8,
              fontSize: 16,
              lineHeight: "24px",
              fontWeight: 600,
              color: "rgb(17,24,39)",
            }}
          >
            $999.99
          </Text>
          <Button
            href="https://react.email"
            style={{
              marginTop: 16,
              borderRadius: 8,
              backgroundColor: "rgb(79,70,229)",
              paddingLeft: 24,
              paddingRight: 24,
              paddingTop: 12,
              paddingBottom: 12,
              fontWeight: 600,
              color: "rgb(255,255,255)",
            }}
          >
            Buy
          </Button>
        </Column>
      </Row>
    </Section>
    <Hr
      style={{
        marginLeft: 0,
        marginRight: 0,
        marginTop: 24,
        marginBottom: 24,
        width: "100%",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "rgb(229,231,235)",
      }}
    />
    <Section>
      <Row>
        <Column
          align="left"
          colSpan={1}
          style={{ width: "50%", paddingRight: 8 }}
        >
          <Img
            alt="A picture of various Apple products laid out on a table. There is an Apple Watch with its box bellow it, there is a MacBook Pro with its box bellow it, there is an Iphone with some box bellow it, there is an Apple Keyboard, and some other items that can't quite be recognized from the picture"
            height={180}
            src="https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=2864&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            style={{
              width: "100%",
              borderRadius: 8,
              objectFit: "cover",
            }}
          />
          <Text
            style={{
              margin: 0,
              marginTop: 24,
              fontSize: 20,
              lineHeight: "28px",
              fontWeight: 600,
              color: "rgb(17,24,39)",
            }}
          >
            Sleek study
          </Text>
          <Text
            style={{
              margin: 0,
              marginTop: 16,
              fontSize: 16,
              lineHeight: "24px",
              color: "rgb(107,114,128)",
            }}
          >
            Minimalist design with ample workspace
          </Text>
          <Text
            style={{
              margin: 0,
              marginTop: 8,
              fontSize: 16,
              lineHeight: "24px",
              fontWeight: 600,
              color: "rgb(17,24,39)",
            }}
          >
            $999.99
          </Text>
          <Button
            href="https://react.email"
            style={{
              marginTop: 16,
              borderRadius: 8,
              backgroundColor: "rgb(79,70,229)",
              paddingLeft: 24,
              paddingRight: 24,
              paddingTop: 12,
              paddingBottom: 12,
              fontWeight: 600,
              color: "rgb(255,255,255)",
            }}
          >
            Buy
          </Button>
        </Column>
        <Column align="left" className="w-1/2 pl-2" colSpan={1}>
          <Img
            alt="A picture of a very nice looking product in a bottle. The bottle has a black tap and it looks like it is brown overall. The product is sitting in front of a bage wall and on top of some wooden round board"
            height={180}
            src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            style={{
              width: "100%",
              borderRadius: 8,
              objectFit: "cover",
            }}
          />
          <Text
            style={{
              margin: 0,
              marginTop: 24,
              fontSize: 20,
              lineHeight: "28px",
              fontWeight: 600,
              color: "rgb(17,24,39)",
            }}
          >
            Sleek study
          </Text>
          <Text
            style={{
              margin: 0,
              marginTop: 16,
              fontSize: 16,
              lineHeight: "24px",
              color: "rgb(107,114,128)",
            }}
          >
            Minimalist design with ample workspace
          </Text>
          <Text
            style={{
              margin: 0,
              marginTop: 8,
              fontSize: 16,
              lineHeight: "24px",
              fontWeight: 600,
              color: "rgb(17,24,39)",
            }}
          >
            $999.99
          </Text>
          <Button
            href="https://react.email"
            style={{
              marginTop: 16,
              borderRadius: 8,
              backgroundColor: "rgb(79,70,229)",
              paddingLeft: 24,
              paddingRight: 24,
              paddingTop: 12,
              paddingBottom: 12,
              fontWeight: 600,
              color: "rgb(255,255,255)",
            }}
          >
            Buy
          </Button>
        </Column>
      </Row>
    </Section>
  </Section>
);

export default () => {
  return <Layout>
    {component}
  </Layout>;
};
