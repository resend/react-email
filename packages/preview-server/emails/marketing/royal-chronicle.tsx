import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Row,
  Column,
  Text,
  Heading,
  Button,
  Hr,
  Link,
  Tailwind,
} from '@react-email/components';

const RoyalKingdomNewsletter = () => {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Body className="bg-gradient-to-b from-purple-900 to-indigo-900 font-sans">
          <Container className="bg-white max-w-[600px] mx-auto rounded-[12px] overflow-hidden shadow-2xl">
            {/* Royal Header */}
            <Section className="bg-gradient-to-r from-purple-800 to-indigo-800 py-[32px] px-[24px]">
              <Heading className="text-red-500 text-[32px] font-bold m-0 mb-[8px] tracking-wide">
                THE ROYAL CHRONICLE
              </Heading>
              <Text className="text-red-500 text-[16px] m-0 italic">
                Official Newsletter of the Kingdom
              </Text>
            </Section>

            {/* Decorative Border */}
            <Section className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 h-[4px]"></Section>

            {/* Main Content */}
            <Section className="px-[32px] py-[40px]">
              {/* Royal Announcement */}
              <Section className="mb-[40px]">
                <Row>
                  <Column>
                    <Text className="text-purple-800 text-[14px] font-semibold uppercase tracking-widest m-0 mb-[12px]">
                      Royal Proclamation
                    </Text>
                    <Heading className="text-gray-800 text-[28px] font-bold m-0 mb-[20px] leading-tight">
                      His Majesty Announces the Grand Festival of Autumn
                    </Heading>
                    <Text className="text-gray-600 text-[16px] leading-relaxed m-0 mb-[24px]">
                      By royal decree, the kingdom shall celebrate the bountiful harvest with three days of festivities.
                      Join us for tournaments, feasts, and entertainment fit for nobility and commoners alike.
                    </Text>
                    <Button
                      href="#"
                      className="bg-purple-700 text-white px-[32px] py-[16px] rounded-[8px] font-semibold text-[16px] no-underline box-border hover:bg-purple-800"
                    >
                      View Royal Invitation
                    </Button>
                  </Column>
                </Row>
              </Section>

              <Hr className="border-purple-200 border-solid my-[32px]" />

              {/* Kingdom News */}
              <Section className="mb-[40px]">
                <Heading className="text-purple-800 text-[24px] font-bold m-0 mb-[24px] text-center">
                  ⚔️ Kingdom Chronicles ⚔️
                </Heading>

                <Row className="mb-[24px]">
                  <Column>
                    <Text className="text-purple-700 text-[18px] font-semibold m-0 mb-[8px]">
                      🏰 Castle Renovations Complete
                    </Text>
                    <Text className="text-gray-600 text-[14px] leading-relaxed m-0">
                      The eastern tower has been fully restored with new battlements and a magnificent view of the kingdom's valleys.
                    </Text>
                  </Column>
                </Row>

                <Row className="mb-[24px]">
                  <Column>
                    <Text className="text-purple-700 text-[18px] font-semibold m-0 mb-[8px]">
                      🛡️ New Knights Inducted
                    </Text>
                    <Text className="text-gray-600 text-[14px] leading-relaxed m-0">
                      Five brave souls have been honored with knighthood for their valor in protecting our trade routes from bandits.
                    </Text>
                  </Column>
                </Row>

                <Row className="mb-[24px]">
                  <Column>
                    <Text className="text-purple-700 text-[18px] font-semibold m-0 mb-[8px]">
                      📜 Royal Library Expansion
                    </Text>
                    <Text className="text-gray-600 text-[14px] leading-relaxed m-0">
                      Ancient scrolls from distant lands have been acquired, expanding our collection of magical and historical texts.
                    </Text>
                  </Column>
                </Row>
              </Section>

              <Hr className="border-purple-200 border-solid my-[32px]" />

              {/* Call to Action */}
              <Section className="text-center bg-purple-50 rounded-[8px] p-[32px] mb-[32px]">
                <Text className="text-[20px] font-bold text-purple-800 m-0 mb-[16px]">
                  🎭 Join the Royal Court
                </Text>
                <Text className="text-gray-600 text-[16px] m-0 mb-[24px]">
                  Become a member of our exclusive royal circle and receive invitations to private events,
                  early access to kingdom announcements, and special privileges.
                </Text>
                <Button
                  href="#"
                  className="bg-yellow-500 text-purple-900 px-[28px] py-[14px] rounded-[8px] font-bold text-[16px] no-underline box-border hover:bg-yellow-400"
                >
                  Join the Court
                </Button>
              </Section>
            </Section>

            {/* Royal Footer */}
            <Section className="bg-gray-100 px-[32px] py-[24px] border-t border-solid border-purple-200">
              <Text className="text-center text-gray-500 text-[12px] m-0 mb-[16px]">
                📍 Royal Palace, Kingdom Square, Enchanted Realm 12345
              </Text>
              <Text className="text-center text-gray-500 text-[12px] m-0 mb-[8px]">
                You are receiving this because you are a valued subject of our kingdom.
              </Text>
              <Text className="text-center text-gray-500 text-[12px] m-0">
                <Link href="#" className="text-purple-600 no-underline">Unsubscribe</Link> |
                <Link href="#" className="text-purple-600 no-underline ml-[8px]">Update Preferences</Link>
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

export default RoyalKingdomNewsletter;