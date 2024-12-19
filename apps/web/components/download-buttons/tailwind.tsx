import { Button, Column, Img, Row, Text } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Row>
    <Column align="center">
      <Row>
        <Text className="text-[18px] font-bold leading-[28px] text-indigo-500">
          Try now
        </Text>
        <Text className="text-gray-900">
          The app all cheese enthusiasts have been waiting for
        </Text>
      </Row>
      <Row>
        <td align="center">
          <table>
            <tr>
              <td className="pr-[16px]">
                <Button href="https://react.email">
                  <Img
                    alt="Get it on Google Play button"
                    height={54}
                    src="/static/get-it-on-google-play.png"
                  />
                </Button>
              </td>
              <td className="pl-[16px]">
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
  return <Layout>{component}</Layout>;
};
