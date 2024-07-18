/* eslint-disable react/no-unescaped-entities */
import { Button, Column, Img, Row, Text } from "@react-email/components";
import { Layout } from "../_components/layout";

export const title = "Download app buttons";

export const DownloadAppButtons = () => {
  return (
    <Layout>
      {/* start pattern code */}
      <Row>
        <Column align="center">
          <Row>
            <Text className="text-indigo-500 font-bold text-lg">
              What's new
            </Text>
            <Text className="text-gray-900">
              Browse, Customize, and Shop an Extensive Range of Furniture
              Anytime, Anywhere with our app
            </Text>
          </Row>
          <Row>
            <td align="center">
              <table>
                <tr>
                  <td className="pr-4">
                    <Button href="https://react.email">
                      <Img
                        height={54}
                        src="/static/get-it-on-google-play.png"
                      />
                    </Button>
                  </td>
                  <td className="pl-4">
                    <Button href="https://react.email">
                      <Img
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
      {/* end pattern code */}
    </Layout>
  );
};

export default DownloadAppButtons;
