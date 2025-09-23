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

const RoyalCourtInvitation = (props) => {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Body className="bg-gradient-to-b from-purple-900 to-indigo-900 font-sans py-[40px]">
          <Container className="bg-white max-w-[600px] mx-auto rounded-[12px] overflow-hidden shadow-2xl">
            {/* Royal Header */}
            <Section className="bg-gradient-to-r from-purple-800 to-indigo-800 text-center py-[32px] px-[24px]">
              <Text className="text-yellow-400 text-[48px] font-bold m-0 mb-[8px]">⚔️</Text>
              <Heading className="text-red-500 text-[32px] font-bold m-0 mb-[8px] tracking-wide">
                ROYAL COURT SUMMONS
              </Heading>
              <Text className="text-red-500 text-[16px] m-0 italic">
                By Order of His Majesty King Arthur
              </Text>
            </Section>

            {/* Decorative Border */}
            <Section className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 h-[4px]"></Section>

            {/* Royal Seal & Invitation Header */}
            <Section className="px-[32px] py-[32px] text-center">
              <Text className="text-yellow-600 text-[32px] m-0 mb-[16px]">🏰</Text>
              <Text className="text-purple-800 text-[14px] font-semibold uppercase tracking-widest m-0 mb-[12px]">
                Royal Proclamation
              </Text>
              <Heading className="text-gray-800 text-[28px] font-bold m-0 mb-[20px] leading-tight">
                Sir {props.knightName}, Knight of the Lake
              </Heading>
              <Text className="text-gray-600 text-[16px] m-0 mb-[24px] italic">
                You are hereby cordially summoned to appear before the Royal Court
              </Text>
            </Section>

            <Hr className="border-purple-200 border-solid mx-[32px]" />

            {/* Main Invitation Content */}
            <Section className="px-[32px] py-[32px]">
              <Section className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-[12px] p-[32px] mb-[32px] border border-solid border-purple-200">
                <Text className="text-gray-700 text-[16px] leading-relaxed m-0 mb-[20px]">
                  Greetings, Noble Sir {props.knightName},
                </Text>
                <Text className="text-gray-700 text-[16px] leading-relaxed m-0 mb-[20px]">
                  His Royal Majesty King Arthur Pendragon, Sovereign of all Britain and Protector of the Realm,
                  requests your esteemed presence at the Royal Court of Camelot for matters of great importance
                  to the kingdom and the sacred fellowship of the Round Table.
                </Text>
                <Text className="text-gray-700 text-[16px] leading-relaxed m-0 mb-[20px]">
                  Your valor in recent quests and unwavering loyalty to the crown have not gone unnoticed.
                  The King wishes to discuss your next noble mission and bestow upon you the recognition
                  befitting a knight of your distinguished service.
                </Text>
                <Text className="text-purple-700 text-[16px] font-semibold m-0 text-center">
                  🛡️ "For Honor, Glory, and the Realm!" 🛡️
                </Text>
              </Section>

              {/* Event Details */}
              <Section className="mb-[32px]">
                <Heading className="text-purple-800 text-[24px] font-bold m-0 mb-[24px] text-center">
                  📜 Royal Court Details
                </Heading>

                <Row className="mb-[16px]">
                  <Column className="w-1/3">
                    <Text className="text-purple-700 text-[16px] font-semibold m-0 mb-[4px]">
                      🗓️ Date & Time
                    </Text>
                  </Column>
                  <Column className="w-2/3">
                    <Text className="text-gray-700 text-[16px] m-0 mb-[2px]">
                      {props.courtDate}
                    </Text>
                    <Text className="text-gray-600 text-[14px] m-0">
                      {props.courtTime} (Royal Court Time)
                    </Text>
                  </Column>
                </Row>

                <Row className="mb-[16px]">
                  <Column className="w-1/3">
                    <Text className="text-purple-700 text-[16px] font-semibold m-0 mb-[4px]">
                      🏰 Location
                    </Text>
                  </Column>
                  <Column className="w-2/3">
                    <Text className="text-gray-700 text-[16px] m-0 mb-[2px]">
                      The Great Hall of Camelot
                    </Text>
                    <Text className="text-gray-600 text-[14px] m-0">
                      Royal Castle, Throne Room Wing
                    </Text>
                  </Column>
                </Row>

                <Row className="mb-[16px]">
                  <Column className="w-1/3">
                    <Text className="text-purple-700 text-[16px] font-semibold m-0 mb-[4px]">
                      👑 Occasion
                    </Text>
                  </Column>
                  <Column className="w-2/3">
                    <Text className="text-gray-700 text-[16px] m-0 mb-[2px]">
                      {props.occasion}
                    </Text>
                    <Text className="text-gray-600 text-[14px] m-0">
                      Formal court session with royal ceremony
                    </Text>
                  </Column>
                </Row>

                <Row className="mb-[16px]">
                  <Column className="w-1/3">
                    <Text className="text-purple-700 text-[16px] font-semibold m-0 mb-[4px]">
                      ⚔️ Dress Code
                    </Text>
                  </Column>
                  <Column className="w-2/3">
                    <Text className="text-gray-700 text-[16px] m-0 mb-[2px]">
                      Full Knight Regalia Required
                    </Text>
                    <Text className="text-gray-600 text-[14px] m-0">
                      Ceremonial armor, sword, and Round Table insignia
                    </Text>
                  </Column>
                </Row>
              </Section>

              <Hr className="border-purple-200 border-solid my-[24px]" />

              {/* Special Instructions */}
              <Section className="mb-[32px]">
                <Text className="text-purple-700 text-[18px] font-semibold m-0 mb-[16px] text-center">
                  🛡️ Royal Court Protocol
                </Text>

                <Text className="text-gray-600 text-[14px] leading-relaxed m-0 mb-[12px]">
                  • Arrive at the castle gates no later than 30 minutes before the appointed time
                </Text>
                <Text className="text-gray-600 text-[14px] leading-relaxed m-0 mb-[12px]">
                  • Present this royal summons to the castle guards for immediate entry
                </Text>
                <Text className="text-gray-600 text-[14px] leading-relaxed m-0 mb-[12px]">
                  • Bring your sword of knighthood and any battle honors for the ceremony
                </Text>
                <Text className="text-gray-600 text-[14px] leading-relaxed m-0 mb-[12px]">
                  • A royal feast will follow the court session in the Knights' Hall
                </Text>
                <Text className="text-gray-600 text-[14px] leading-relaxed m-0">
                  • Quarters will be provided in the castle should you require overnight stay
                </Text>
              </Section>

              {/* RSVP Section */}
              <Section className="text-center bg-yellow-50 rounded-[12px] p-[32px] mb-[32px] border border-solid border-yellow-200">
                <Text className="text-[20px] font-bold text-purple-800 m-0 mb-[16px]">
                  ⚔️ Confirm Your Attendance, Sir {props.knightName}
                </Text>
                <Text className="text-gray-600 text-[16px] m-0 mb-[24px]">
                  The King awaits your response. Will you answer the call to serve the realm once more?
                </Text>
                <Button
                  href="#"
                  className="bg-purple-700 text-white px-[40px] py-[16px] rounded-[8px] font-semibold text-[16px] no-underline box-border hover:bg-purple-800 mr-[12px]"
                >
                  🏰 Accept Royal Summons
                </Button>
                <Button
                  href="#"
                  className="bg-red-600 text-white px-[32px] py-[16px] rounded-[8px] font-semibold text-[16px] no-underline box-border hover:bg-red-700"
                >
                  ⚔️ Send Regrets
                </Button>
              </Section>

              {/* Who Will Attend */}
              <Section className="mb-[32px]">
                <Text className="text-purple-700 text-[18px] font-semibold m-0 mb-[16px] text-center">
                  🛡️ Fellow Knights in Attendance
                </Text>
                <Row>
                  <Column className="w-1/2">
                    <Text className="text-gray-600 text-[14px] m-0 mb-[4px]">• Sir Gawain of Orkney</Text>
                    <Text className="text-gray-600 text-[14px] m-0 mb-[4px]">• Sir Percival the Pure</Text>
                    <Text className="text-gray-600 text-[14px] m-0 mb-[4px]">• Sir Gareth the Courteous</Text>
                  </Column>
                  <Column className="w-1/2">
                    <Text className="text-gray-600 text-[14px] m-0 mb-[4px]">• Sir Galahad the Perfect</Text>
                    <Text className="text-gray-600 text-[14px] m-0 mb-[4px]">• Sir Tristan of Lyonesse</Text>
                    <Text className="text-gray-600 text-[14px] m-0 mb-[4px]">• Sir Bedivere the Loyal</Text>
                  </Column>
                </Row>
                <Text className="text-center text-purple-600 text-[14px] m-0 mt-[16px] italic">
                  The complete fellowship of the Round Table shall gather once more!
                </Text>
              </Section>

              {/* Royal Message */}
              <Section className="text-center bg-purple-100 rounded-[8px] p-[24px] mb-[32px] border border-solid border-purple-300">
                <Text className="text-[16px] font-semibold text-purple-800 m-0 mb-[12px]">
                  👑 Personal Message from King Arthur
                </Text>
                <Text className="text-gray-700 text-[14px] m-0 italic leading-relaxed">
                  "Sir {props.knightName}, your courage in the face of darkness and your dedication to the
                  ideals of chivalry continue to inspire all who serve under the banner of Camelot.
                  I look forward to our reunion and the great deeds that lie ahead."
                </Text>
                <Text className="text-purple-700 text-[14px] font-semibold m-0 mt-[12px]">
                  - Arthur Pendragon, King of all Britain
                </Text>
              </Section>
            </Section>

            {/* Royal Footer */}
            <Section className="bg-gray-100 px-[32px] py-[24px] border-t border-solid border-purple-200">
              <Text className="text-center text-gray-500 text-[12px] m-0 mb-[16px]">
                📍 Royal Court of Camelot, Castle Grounds, Kingdom of Britain
              </Text>
              <Text className="text-center text-gray-500 text-[12px] m-0 mb-[8px]">
                This summons bears the Royal Seal and is issued by direct order of His Majesty.
              </Text>
              <Text className="text-center text-gray-500 text-[12px] m-0">
                <Link href="#" className="text-purple-600 no-underline">Court Protocol</Link> |
                <Link href="#" className="text-purple-600 no-underline ml-[8px]">Castle Directions</Link> |
                <Link href="#" className="text-purple-600 no-underline ml-[8px]">Royal Messenger</Link>
              </Text>
              <Text className="text-center text-gray-400 text-[12px] m-0 mt-[16px]">
                © 2025 Royal Court of Camelot. By divine right and noble decree.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

RoyalCourtInvitation.PreviewProps = {
  knightName: "Lancelot",
  courtDate: "The 15th Day of February, Year of Our Lord 2025",
  courtTime: "High Noon",
  occasion: "Round Table Council & Quest Assignment",
};

export default RoyalCourtInvitation;