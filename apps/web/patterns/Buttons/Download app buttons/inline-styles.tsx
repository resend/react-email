/* eslint-disable react/no-unescaped-entities */
import { Button, Column, Img, Row, Text } from "@react-email/components";
import { Layout } from "../../_components/layout";

export const pattern = (
  <Row>
    <Column align="center">
      <Row>
        <Text
          style={{
            color: "rgb(99,102,241)",
            fontWeight: 700,
            fontSize: 18,
            lineHeight: "28px",
          }}
        >
          What's new
        </Text>
        <Text
          style={{
            color: "rgb(17,24,39)",
          }}
        >
          Browse, Customize, and Shop an Extensive Range of Furniture Anytime,
          Anywhere with our app
        </Text>
      </Row>
      <Row>
        <td align="center">
          <table>
            <tr>
              <td style={{ paddingRight: 16 }}>
                <Button href="https://react.email">
                  <Img
                    alt="Get it on Google Play button"
                    height={54}
                    src="/static/get-it-on-google-play.png"
                  />
                </Button>
              </td>
              <td style={{ paddingLeft: 16 }}>
                <Button href="https://react.email">
                  <Img
                    alt="Download on the App Store button"
                    height={54}
                    src="/static/download-on-the-app-store.png"
                  />
                </Button>
              </td>
            </tr>
          </table>
        </td>
      </Row>
    </Column>
  </Row>
);

export default () => {
  return <Layout>{pattern}</Layout>;
};