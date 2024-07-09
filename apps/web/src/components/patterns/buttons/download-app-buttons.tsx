/* eslint-disable react/no-unescaped-entities */
import { Button, Column, Img, Row, Text } from "@react-email/components";

export const title = "Download app buttons";

export const downloadAppButtons = (
  /* start pattern code */
  <Row>
    <Column align="center">
      <Row>
        <Text className="text-indigo-500 font-bold text-[18px]">
          What's new
        </Text>
        <Text className="text-gray-900">
          Browse, Customize, and Shop an Extensive Range of Furniture Anytime,
          Anywhere with our app
        </Text>
      </Row>
      <Row>
        <td align="center">
          <table>
            <tr>
              <td className="pr-4">
                <Button
                  className="w-[170px] box-border bg-black px-[8px] py-[6px] rounded-[12px]"
                  href="#"
                >
                  <Row className="bg-black">
                    <Column className="pr-[12px]">
                      <Img
                        alt="Google Play Logo"
                        src="/static/google-play-logo.png"
                        width="32"
                      />
                    </Column>
                    <Column>
                      <table>
                        <tr>
                          <Text className="m-0 font-bold leading-[12px] text-[10px] text-white">
                            GET IT ON
                          </Text>
                        </tr>
                        <tr>
                          <Text className="m-0 font-bold text-[20px] text-white">
                            Google Play
                          </Text>
                        </tr>
                      </table>
                    </Column>
                  </Row>
                </Button>
              </td>
              <td className="pl-4">
                <Button
                  className="w-[170px] box-border bg-black px-[8px] py-[6px] rounded-[12px]"
                  href="#"
                >
                  <Row className="bg-black">
                    <Column className="pr-[12px]">
                      <Img
                        alt="Apple Logo"
                        src="/static/apple-logo.png"
                        width="32"
                      />
                    </Column>
                    <Column>
                      <table>
                        <tr>
                          <Text className="m-0 font-bold text-white leading-[12px] text-[13px]">
                            Download on the
                          </Text>
                        </tr>
                        <tr>
                          <Text className="m-0 font-bold text-white text-[24px]">
                            App Store
                          </Text>
                        </tr>
                      </table>
                    </Column>
                  </Row>
                </Button>
              </td>
            </tr>
          </table>
        </td>
      </Row>
    </Column>
  </Row>
  /* end pattern code */
);

export default downloadAppButtons;
