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

const RoyalWelcomeEmail = (props) => {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Body className="bg-gradient-to-b from-purple-900 to-indigo-900 font-sans">
          <Container className="bg-white max-w-[600px] mx-auto rounded-[12px] overflow-hidden shadow-2xl">
            {/* Royal Header */}
            <Section className="bg-gradient-to-r from-purple-800 to-indigo-800 py-[32px] px-[24px]">
              <Heading className="text-red-500 text-[32px] font-bold m-0 mb-[8px] tracking-wide">
                WELCOME TO THE KINGDOM
              </Heading>
              <Text className="text-red-500 text-[16px] m-0 italic">
                Your Royal Journey Begins
              </Text>
            </Section>

            {/* Decorative Border */}
            <Section className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 h-[4px]" />

            {/* Main Content */}
            <Section className="px-[32px] py-[40px]">
              {/* Personal Welcome */}
              <Section className="mb-[40px] text-center">
                <Text className="text-purple-800 text-[14px] font-semibold uppercase tracking-widest m-0 mb-[12px]">
                  Royal Proclamation
                </Text>
                <Heading className="text-gray-800 text-[32px] font-bold m-0 mb-[20px] leading-tight">
                  Hail, Noble {props.firstName}! 🎉
                </Heading>
                <Text className="text-gray-600 text-[18px] leading-relaxed m-0 mb-[24px]">
                  By royal decree, you have been officially welcomed into our
                  magnificent kingdom! Your presence brings honor to our realm,
                  and we are delighted to have you among our esteemed subjects.
                </Text>
                <Text className="text-purple-700 text-[16px] font-semibold m-0">
                  ⚔️ Your adventure in the kingdom starts now! ⚔️
                </Text>
              </Section>

              {/* Royal Benefits */}
              <Section className="mb-[40px]">
                <Heading className="text-purple-800 text-[24px] font-bold m-0 mb-[24px] text-center">
                  🏰 Your Royal Privileges
                </Heading>

                <Row className="mb-[20px]">
                  <Column>
                    <Text className="text-purple-700 text-[18px] font-semibold m-0 mb-[8px]">
                      👑 Noble Status Granted
                    </Text>
                    <Text className="text-gray-600 text-[14px] leading-relaxed m-0">
                      You now hold the distinguished title of Noble{' '}
                      {props.firstName}, with all the rights and privileges that
                      come with it.
                    </Text>
                  </Column>
                </Row>

                <Row className="mb-[20px]">
                  <Column>
                    <Text className="text-purple-700 text-[18px] font-semibold m-0 mb-[8px]">
                      🗝️ Access to Royal Chambers
                    </Text>
                    <Text className="text-gray-600 text-[14px] leading-relaxed m-0">
                      Explore exclusive areas of the kingdom, including the
                      Royal Library, Treasury, and private gardens.
                    </Text>
                  </Column>
                </Row>

                <Row className="mb-[20px]">
                  <Column>
                    <Text className="text-purple-700 text-[18px] font-semibold m-0 mb-[8px]">
                      📜 Royal Newsletter Subscription
                    </Text>
                    <Text className="text-gray-600 text-[14px] leading-relaxed m-0">
                      Receive weekly updates about kingdom events, royal
                      announcements, and exclusive invitations.
                    </Text>
                  </Column>
                </Row>

                <Row className="mb-[20px]">
                  <Column>
                    <Text className="text-purple-700 text-[18px] font-semibold m-0 mb-[8px]">
                      🎭 VIP Event Access
                    </Text>
                    <Text className="text-gray-600 text-[14px] leading-relaxed m-0">
                      Priority invitations to royal banquets, tournaments,
                      festivals, and other exclusive gatherings.
                    </Text>
                  </Column>
                </Row>
              </Section>

              <Hr className="border-purple-200 border-solid my-[32px]" />

              {/* Getting Started */}
              <Section className="text-center bg-gradient-to-r from-purple-50 to-indigo-50 rounded-[12px] p-[32px] mb-[32px] border border-solid border-purple-200">
                <Text className="text-[20px] font-bold text-purple-800 m-0 mb-[16px]">
                  🚀 Ready to Begin Your Quest, {props.firstName}?
                </Text>
                <Text className="text-gray-600 text-[16px] m-0 mb-[24px]">
                  Complete your royal profile and explore all the wonders our
                  kingdom has to offer. Your fellow nobles are eager to meet
                  you!
                </Text>
                <Button
                  href="#"
                  className="bg-purple-700 text-white px-[32px] py-[16px] rounded-[8px] font-semibold text-[16px] no-underline box-border hover:bg-purple-800 mr-[12px]"
                >
                  🏰 Explore Kingdom
                </Button>
                <Button
                  href="#"
                  className="bg-yellow-500 text-purple-900 px-[32px] py-[16px] rounded-[8px] font-semibold text-[16px] no-underline box-border hover:bg-yellow-400"
                >
                  👤 Complete Profile
                </Button>
              </Section>

              {/* Royal Guidance */}
              <Section className="mb-[32px]">
                <Row>
                  <Column>
                    <Text className="text-purple-700 text-[18px] font-semibold m-0 mb-[16px] text-center">
                      📚 New Noble's Guide
                    </Text>
                    <Text className="text-gray-600 text-[14px] leading-relaxed m-0 mb-[12px]">
                      • Visit the Royal Help Center for answers to common
                      questions
                    </Text>
                    <Text className="text-gray-600 text-[14px] leading-relaxed m-0 mb-[12px]">
                      • Join our community forums to connect with fellow nobles
                    </Text>
                    <Text className="text-gray-600 text-[14px] leading-relaxed m-0 mb-[12px]">
                      • Download the Kingdom mobile app for on-the-go access
                    </Text>
                    <Text className="text-gray-600 text-[14px] leading-relaxed m-0">
                      • Contact the Royal Guard if you need any assistance
                    </Text>
                  </Column>
                </Row>
              </Section>

              {/* Personal Message */}
              <Section className="text-center bg-yellow-50 rounded-[8px] p-[24px] mb-[32px] border border-solid border-yellow-200">
                <Text className="text-[16px] font-semibold text-purple-800 m-0 mb-[12px]">
                  💌 A Personal Message from the Royal Council
                </Text>
                <Text className="text-gray-600 text-[14px] m-0 italic">
                  "Dear {props.firstName}, we are thrilled to welcome you to our
                  kingdom family. May your journey be filled with adventure,
                  friendship, and countless magical moments. Welcome home, noble
                  one!"
                </Text>
              </Section>
            </Section>

            {/* Royal Footer */}
            <Section className="bg-gray-100 px-[32px] py-[24px] border-t border-solid border-purple-200">
              <Text className="text-center text-gray-500 text-[12px] m-0 mb-[16px]">
                📍 Royal Palace, Kingdom Square, Enchanted Realm 12345
              </Text>
              <Text className="text-center text-gray-500 text-[12px] m-0 mb-[8px]">
                Welcome to the kingdom, {props.firstName}! We're honored to have
                you with us.
              </Text>
              <Text className="text-center text-gray-500 text-[12px] m-0">
                <Link href="#" className="text-purple-600 no-underline">
                  Help Center
                </Link>{' '}
                |
                <Link
                  href="#"
                  className="text-purple-600 no-underline ml-[8px]"
                >
                  Community
                </Link>{' '}
                |
                <Link
                  href="#"
                  className="text-purple-600 no-underline ml-[8px]"
                >
                  Contact Support
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

RoyalWelcomeEmail.PreviewProps = {
  firstName: 'Arthur',
};

export default RoyalWelcomeEmail;
