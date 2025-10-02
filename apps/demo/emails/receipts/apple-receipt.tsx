import {
  Body,
  Column,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import tailwindConfig from '../tailwind.config';

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

export const AppleReceiptEmail = () => (
  <Html>
    <Head />
    <Tailwind config={tailwindConfig}>
      <Body className="font-apple bg-white">
        <Preview>Apple Receipt</Preview>
        <Container className="mx-auto py-5 pb-12 w-[660px] max-w-full">
          <Section>
            <Row>
              <Column>
                <Img
                  src={`${baseUrl}/static/apple-logo.png`}
                  width="42"
                  height="42"
                  alt="Apple Logo"
                />
              </Column>

              <Column align="right" className="table-cell">
                <Text className="text-3xl font-light text-[#888888] m-0 p-0 leading-[1.4]">
                  Receipt
                </Text>
              </Column>
            </Row>
          </Section>
          <Section>
            <Text className="text-center m-0 my-9 text-sm font-medium text-[#111111] p-0 leading-[1.4]">
              Save 3% on all your Apple purchases with Apple Card.
              <sup className="font-light">1</sup>{' '}
              <Link href="https://www.apple.com/apple-card/">
                Apply and use in minutes
              </Link>
              <sup className="font-light">2</sup>
            </Text>
          </Section>
          <Section className="border-collapse border-spacing-0 text-[rgb(51,51,51)] bg-[rgb(250,250,250)] rounded text-xs">
            <Row className="min-h-[46px]">
              <Column colSpan={2}>
                <Section>
                  <Row>
                    <Column className="pl-5 border-solid border-white border-r border-b min-h-[44px]">
                      <Text className="m-0 p-0 leading-[1.4] text-[rgb(102,102,102)] text-[10px]">
                        APPLE ID
                      </Text>
                      <Link className="text-xs m-0 p-0 leading-[1.4] text-[#15c] underline">
                        alan.turing@gmail.com
                      </Link>
                    </Column>
                  </Row>

                  <Row>
                    <Column className="pl-5 border-solid border-white border-r border-b min-h-[44px]">
                      <Text className="m-0 p-0 leading-[1.4] text-[rgb(102,102,102)] text-[10px]">
                        INVOICE DATE
                      </Text>
                      <Text className="text-xs m-0 p-0 leading-[1.4]">
                        18 Jan 2023
                      </Text>
                    </Column>
                  </Row>

                  <Row>
                    <Column className="pl-5 border-solid border-white border-r border-b min-h-[44px]">
                      <Text className="m-0 p-0 leading-[1.4] text-[rgb(102,102,102)] text-[10px]">
                        ORDER ID
                      </Text>
                      <Link className="text-xs m-0 p-0 leading-[1.4] text-[#15c] underline">
                        ML4F5L8522
                      </Link>
                    </Column>
                    <Column className="pl-5 border-solid border-white border-r border-b min-h-[44px]">
                      <Text className="m-0 p-0 leading-[1.4] text-[rgb(102,102,102)] text-[10px]">
                        DOCUMENT NO.
                      </Text>
                      <Text className="text-xs m-0 p-0 leading-[1.4]">
                        186623754793
                      </Text>
                    </Column>
                  </Row>
                </Section>
              </Column>
              <Column
                className="pl-5 border-solid border-white border-r border-b min-h-[44px]"
                colSpan={2}
              >
                <Text className="m-0 p-0 leading-[1.4] text-[rgb(102,102,102)] text-[10px]">
                  BILLED TO
                </Text>
                <Text className="text-xs m-0 p-0 leading-[1.4]">
                  Visa .... 7461 (Apple Pay)
                </Text>
                <Text className="text-xs m-0 p-0 leading-[1.4]">
                  Alan Turing
                </Text>
                <Text className="text-xs m-0 p-0 leading-[1.4]">
                  2125 Chestnut St
                </Text>
                <Text className="text-xs m-0 p-0 leading-[1.4]">
                  San Francisco, CA 94123
                </Text>
                <Text className="text-xs m-0 p-0 leading-[1.4]">USA</Text>
              </Column>
            </Row>
          </Section>
          <Section className="border-collapse border-spacing-0 text-[rgb(51,51,51)] bg-[rgb(250,250,250)] rounded text-xs my-8 mb-4 min-h-[24px]">
            <Text className="bg-[#fafafa] pl-2 text-sm font-medium m-0">
              App Store
            </Text>
          </Section>
          <Section>
            <Row>
              <Column className="w-16">
                <Img
                  src={`${baseUrl}/static/apple-hbo-max-icon.jpeg`}
                  width="64"
                  height="64"
                  alt="HBO Max"
                  className="ml-5 rounded-[14px] border border-[rgb(242,242,242)]"
                />
              </Column>
              <Column className="pl-6">
                <Text className="text-xs font-semibold m-0 p-0 leading-[1.4]">
                  HBO Max: Stream TV &amp; Movies
                </Text>
                <Text className="text-xs text-[rgb(102,102,102)] m-0 p-0 leading-[1.4]">
                  HBO Max Ad-Free (Monthly)
                </Text>
                <Text className="text-xs text-[rgb(102,102,102)] m-0 p-0 leading-[1.4]">
                  Renews Aug 20, 2023
                </Text>
                <Link
                  href="https://www.apple.com/"
                  className="text-xs text-[rgb(0,112,201)] no-underline"
                >
                  Write a Review
                </Link>
                <span className="mx-1 text-[rgb(51,51,51)] font-extralight">
                  |
                </span>
                <Link
                  href="https://www.apple.com/"
                  className="text-xs text-[rgb(0,112,201)] no-underline"
                >
                  Report a Problem
                </Link>
              </Column>

              <Column
                className="table-cell pr-5 w-[100px] align-top"
                align="right"
              >
                <Text className="text-xs font-semibold m-0">$14.99</Text>
              </Column>
            </Row>
          </Section>
          <Hr className="mt-8 mb-0" />
          <Section align="right">
            <Row>
              <Column className="table-cell" align="right">
                <Text className="m-0 text-[rgb(102,102,102)] text-[10px] font-semibold pr-8 text-right">
                  TOTAL
                </Text>
              </Column>
              <Column className="min-h-12 pt-12 border-l border-[rgb(238,238,238)]" />
              <Column className="table-cell w-[90px]">
                <Text className="mr-5 text-base font-semibold whitespace-nowrap text-right">
                  $14.99
                </Text>
              </Column>
            </Row>
          </Section>
          <Hr className="mb-20" />
          <Section>
            <Row>
              <Column align="center" className="block">
                <Img
                  src={`${baseUrl}/static/apple-card-icon.png`}
                  width="60"
                  height="17"
                  alt="Apple Card"
                />
              </Column>
            </Row>
          </Section>
          <Section>
            <Row>
              <Column align="center" className="block mt-4">
                <Text className="text-2xl font-medium">
                  Save 3% on all your Apple purchases.
                </Text>
              </Column>
            </Row>
          </Section>
          <Section>
            <Row>
              <Column align="center" className="table-cell mt-3">
                <Link
                  href="https://www.apple.com/"
                  className="text-[rgb(0,126,255)] no-underline"
                >
                  <Img
                    src={`${baseUrl}/static/apple-wallet.png`}
                    width="28"
                    height="28"
                    alt="Apple Wallet"
                    className="inline pr-2 align-middle"
                  />
                  <span className="text-sm font-normal no-underline">
                    Apply and use in minutes
                  </span>
                </Link>
              </Column>
            </Row>
          </Section>
          <Hr className="my-16 mb-5" />
          <Text className="text-xs text-[rgb(102,102,102)] m-0 leading-auto mb-4">
            1. 3% savings is earned as Daily Cash and is transferred to your
            Apple Cash card when transactions post to your Apple Card account.
            If you do not have an Apple Cash card, Daily Cash can be applied by
            you as a credit on your statement balance. 3% is the total amount of
            Daily Cash earned for these purchases. See the Apple Card Customer
            Agreement for more details on Daily Cash and qualifying
            transactions.
          </Text>
          <Text className="text-xs text-[rgb(102,102,102)] m-0 leading-auto mb-4">
            2. Subject to credit approval.
          </Text>
          <Text className="text-xs text-[rgb(102,102,102)] m-0 leading-auto mb-4">
            To access and use all the features of Apple Card, you must add Apple
            Card to Wallet on an iPhone or iPad with iOS or iPadOS 13.2 or
            later. Update to the latest version of iOS or iPadOS by going to
            Settings &gt; General &gt; Software Update. Tap Download and
            Install.
          </Text>
          <Text className="text-xs text-[rgb(102,102,102)] m-0 leading-auto mb-4">
            Available for qualifying applicants in the United States.
          </Text>
          <Text className="text-xs text-[rgb(102,102,102)] m-0 leading-auto mb-4">
            Apple Card is issued by Goldman Sachs Bank USA, Salt Lake City
            Branch.
          </Text>
          <Text className="text-xs text-[rgb(102,102,102)] m-0 leading-auto mb-4">
            If you reside in the US territories, please call Goldman Sachs at
            877-255-5923 with questions about Apple Card.
          </Text>
          <Text className="text-xs text-[rgb(102,102,102)] my-5 leading-auto text-center">
            Privacy: We use a
            <Link
              href="https://www.apple.com/"
              className="text-[rgb(0,115,255)]"
            >
              {' '}
              Subscriber ID{' '}
            </Link>
            to provide reports to developers.
          </Text>
          <Text className="text-xs text-[rgb(102,102,102)] my-5 leading-auto text-center">
            Get help with subscriptions and purchases.
            <Link
              href="https://www.apple.com/"
              className="text-[rgb(0,115,255)]"
            >
              Visit Apple Support.
            </Link>
          </Text>
          <Text className="text-xs text-[rgb(102,102,102)] my-5 leading-auto text-center">
            Learn how to{' '}
            <Link href="https://www.apple.com/">
              manage your password preferences
            </Link>{' '}
            for iTunes, Apple Books, and App Store purchases.
          </Text>

          <Text className="text-xs text-[rgb(102,102,102)] my-5 leading-auto text-center">
            {' '}
            You have the option to stop receiving email receipts for your
            subscription renewals. If you have opted out, you can still view
            your receipts in your account under Purchase History. To manage
            receipts or to opt in again, go to{' '}
            <Link href="https://www.apple.com/">Account Settings.</Link>
          </Text>
          <Section>
            <Row>
              <Column align="center" className="block mt-10">
                <Img
                  src={`${baseUrl}/static/apple-logo.png`}
                  width="26"
                  height="26"
                  alt="Apple Card"
                />
              </Column>
            </Row>
          </Section>
          <Text className="mt-2 text-center text-xs text-[rgb(102,102,102)]">
            <Link href="https://www.apple.com/">Account Settings</Link> •{' '}
            <Link href="https://www.apple.com/">Terms of Sale</Link> •{' '}
            <Link href="https://www.apple.com/legal/privacy/">
              Privacy Policy{' '}
            </Link>
          </Text>
          <Text className="mt-6 text-center text-xs text-[rgb(102,102,102)]">
            Copyright © 2023 Apple Inc. <br />{' '}
            <Link href="https://www.apple.com/legal/">All rights reserved</Link>
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default AppleReceiptEmail;
