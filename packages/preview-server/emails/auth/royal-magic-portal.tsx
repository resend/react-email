import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import * as React from 'react';

const RoyalMagicLinkEmail = (props) => {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Body className="bg-gradient-to-b from-purple-900 to-indigo-900 font-sans">
          <Container className="bg-white max-w-[600px] mx-auto rounded-[12px] overflow-hidden shadow-2xl">
            {/* Royal Header */}
            <Section className="bg-gradient-to-r from-purple-800 to-indigo-800 py-[32px] px-[24px]">
              <Heading className="text-red-500 text-[32px] font-bold m-0 mb-[8px] tracking-wide">
                ROYAL MAGIC PORTAL
              </Heading>
              <Text className="text-red-500 text-[16px] m-0 italic">
                Your Gateway to the Kingdom
              </Text>
            </Section>

            {/* Decorative Border */}
            <Section className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 h-[4px]" />

            {/* Main Content */}
            <Section className="px-[32px] py-[40px]">
              {/* Magic Link Announcement */}
              <Section className="mb-[40px] text-center">
                <Text className="text-purple-800 text-[14px] font-semibold uppercase tracking-widest m-0 mb-[12px]">
                  Royal Summons
                </Text>
                <Heading className="text-gray-800 text-[28px] font-bold m-0 mb-[20px] leading-tight">
                  ✨ Your Magic Portal Awaits ✨
                </Heading>
                <Text className="text-gray-600 text-[16px] leading-relaxed m-0 mb-[32px]">
                  By royal decree, you have been granted access to the kingdom's
                  sacred portal. Use the enchanted code below to enter the realm
                  and claim your rightful place among the nobility.
                </Text>
              </Section>

              {/* Magic Code Section */}
              <Section className="text-center bg-gradient-to-r from-purple-50 to-indigo-50 rounded-[12px] p-[32px] mb-[32px] border border-solid border-purple-200">
                <Text className="text-purple-800 text-[16px] font-semibold m-0 mb-[16px]">
                  🗝️ Your Royal Authentication Code
                </Text>
                <Text className="bg-white text-purple-900 text-[32px] font-bold tracking-widest px-[24px] py-[16px] rounded-[8px] border-2 border-solid border-purple-300 m-0 mb-[24px] font-mono">
                  {props.authCode}
                </Text>
                <Text className="text-gray-600 text-[14px] m-0 mb-[24px]">
                  This magical code is valid for 10 minutes and can only be used
                  once.
                </Text>
                <Button
                  href="#"
                  className="bg-purple-700 text-white px-[32px] py-[16px] rounded-[8px] font-semibold text-[16px] no-underline box-border hover:bg-purple-800"
                >
                  🚪 Enter the Kingdom
                </Button>
              </Section>

              <Hr className="border-purple-200 border-solid my-[32px]" />

              {/* Security Notice */}
              <Section className="mb-[32px]">
                <Row>
                  <Column>
                    <Text className="text-purple-700 text-[18px] font-semibold m-0 mb-[16px] text-center">
                      🛡️ Royal Security Notice
                    </Text>
                    <Text className="text-gray-600 text-[14px] leading-relaxed m-0 mb-[12px]">
                      • This magic link was requested from your trusted device
                    </Text>
                    <Text className="text-gray-600 text-[14px] leading-relaxed m-0 mb-[12px]">
                      • The enchantment expires in 10 minutes for your
                      protection
                    </Text>
                    <Text className="text-gray-600 text-[14px] leading-relaxed m-0 mb-[12px]">
                      • If you did not request access, please ignore this royal
                      message
                    </Text>
                    <Text className="text-gray-600 text-[14px] leading-relaxed m-0">
                      • Never share your authentication code with other subjects
                    </Text>
                  </Column>
                </Row>
              </Section>

              {/* Alternative Access */}
              <Section className="text-center bg-yellow-50 rounded-[8px] p-[24px] mb-[32px] border border-solid border-yellow-200">
                <Text className="text-[16px] font-semibold text-purple-800 m-0 mb-[12px]">
                  🔐 Having Trouble with the Portal?
                </Text>
                <Text className="text-gray-600 text-[14px] m-0 mb-[16px]">
                  If the magic code doesn't work, you can request a new
                  enchantment or contact the Royal Guard for assistance.
                </Text>
                <Link
                  href="#"
                  className="text-purple-700 font-semibold text-[14px] no-underline"
                >
                  Request New Magic Link
                </Link>
              </Section>
            </Section>

            {/* Royal Footer */}
            <Section className="bg-gray-100 px-[32px] py-[24px] border-t border-solid border-purple-200">
              <Text className="text-center text-gray-500 text-[12px] m-0 mb-[16px]">
                📍 Royal Palace, Kingdom Square, Enchanted Realm 12345
              </Text>
              <Text className="text-center text-gray-500 text-[12px] m-0 mb-[8px]">
                This message was sent to protect your royal account security.
              </Text>
              <Text className="text-center text-gray-500 text-[12px] m-0">
                <Link href="#" className="text-purple-600 no-underline">
                  Privacy Policy
                </Link>{' '}
                |
                <Link
                  href="#"
                  className="text-purple-600 no-underline ml-[8px]"
                >
                  Contact Royal Guard
                </Link>
              </Text>
              <Text className="text-center text-gray-400 text-[12px] m-0 mt-[16px]">
                © 2025 The Royal Kingdom. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

RoyalMagicLinkEmail.PreviewProps = {
  authCode: 'CROWN-2025',
};

export default RoyalMagicLinkEmail;
