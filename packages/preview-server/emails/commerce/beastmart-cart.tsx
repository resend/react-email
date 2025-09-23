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

const RoyalBeastmartCart = (props) => {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Body className="bg-gradient-to-b from-purple-900 to-indigo-900 font-sans">
          <Container className="bg-white max-w-[600px] mx-auto rounded-[12px] overflow-hidden shadow-2xl">
            {/* Royal Header */}
            <Section className="bg-gradient-to-r from-purple-800 to-indigo-800 py-[32px] px-[24px]">
              <Heading className="text-red-500 text-[32px] font-bold m-0 mb-[8px] tracking-wide">
                ROYAL BEASTMART CART
              </Heading>
              <Text className="text-red-500 text-[16px] m-0 italic">
                Premium Magical Creatures & Companions
              </Text>
            </Section>

            {/* Decorative Border */}
            <Section className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 h-[4px]"></Section>

            {/* Cart Header */}
            <Section className="px-[32px] py-[24px]">
              <Row>
                <Column className="w-2/3">
                  <Text className="text-purple-800 text-[14px] font-semibold uppercase tracking-widest m-0 mb-[8px]">
                    Shopping For
                  </Text>
                  <Text className="text-gray-800 text-[18px] font-bold m-0 mb-[4px]">
                    Noble {props.customerName}
                  </Text>
                  <Text className="text-gray-600 text-[14px] m-0">
                    Cart ID: #{props.cartId}
                  </Text>
                </Column>
                <Column className="w-1/3 text-right">
                  <Text className="text-purple-800 text-[14px] font-semibold uppercase tracking-widest m-0 mb-[8px]">
                    Cart Status
                  </Text>
                  <Text className="text-green-600 text-[16px] font-bold m-0 mb-[4px]">
                    Ready for Checkout ✅
                  </Text>
                  <Text className="text-gray-600 text-[14px] m-0">
                    {props.itemCount} magical creatures
                  </Text>
                </Column>
              </Row>
            </Section>

            <Hr className="border-purple-200 border-solid mx-[32px]" />

            {/* Cart Items */}
            <Section className="px-[32px] py-[32px]">
              <Heading className="text-purple-800 text-[24px] font-bold m-0 mb-[24px] text-center">
                🦄 Your Magical Menagerie
              </Heading>

              {/* Item 1 - Dragon */}
              <Section className="bg-gradient-to-r from-red-50 to-orange-50 rounded-[12px] p-[20px] mb-[16px] border border-solid border-red-200">
                <Row>
                  <Column className="w-1/6">
                    <Text className="text-[32px] m-0 text-center">🐉</Text>
                  </Column>
                  <Column className="w-1/2">
                    <Text className="text-red-700 text-[18px] font-bold m-0 mb-[4px]">
                      Baby Fire Dragon
                    </Text>
                    <Text className="text-gray-600 text-[12px] m-0 mb-[2px]">
                      Age: 6 months • Breed: Crimson Flame
                    </Text>
                    <Text className="text-gray-600 text-[12px] m-0 mb-[2px]">
                      Special: Breathes warm embers, house-trained
                    </Text>
                    <Text className="text-gray-600 text-[12px] m-0">
                      Care Level: Intermediate
                    </Text>
                  </Column>
                  <Column className="w-1/6 text-center">
                    <Text className="text-gray-600 text-[14px] m-0 mb-[4px]">Qty</Text>
                    <Text className="text-gray-800 text-[16px] font-bold m-0">1</Text>
                  </Column>
                  <Column className="w-1/6 text-right">
                    <Text className="text-red-700 text-[18px] font-bold m-0">
                      1,500
                    </Text>
                    <Text className="text-gray-600 text-[12px] m-0">Gold</Text>
                  </Column>
                </Row>
              </Section>

              {/* Item 2 - Unicorn */}
              <Section className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-[12px] p-[20px] mb-[16px] border border-solid border-pink-200">
                <Row>
                  <Column className="w-1/6">
                    <Text className="text-[32px] m-0 text-center">🦄</Text>
                  </Column>
                  <Column className="w-1/2">
                    <Text className="text-purple-700 text-[18px] font-bold m-0 mb-[4px]">
                      Royal Unicorn Mare
                    </Text>
                    <Text className="text-gray-600 text-[12px] m-0 mb-[2px]">
                      Age: 3 years • Breed: Starlight Celestial
                    </Text>
                    <Text className="text-gray-600 text-[12px] m-0 mb-[2px]">
                      Special: Healing magic, rainbow mane
                    </Text>
                    <Text className="text-gray-600 text-[12px] m-0">
                      Care Level: Expert
                    </Text>
                  </Column>
                  <Column className="w-1/6 text-center">
                    <Text className="text-gray-600 text-[14px] m-0 mb-[4px]">Qty</Text>
                    <Text className="text-gray-800 text-[16px] font-bold m-0">1</Text>
                  </Column>
                  <Column className="w-1/6 text-right">
                    <Text className="text-purple-700 text-[18px] font-bold m-0">
                      3,200
                    </Text>
                    <Text className="text-gray-600 text-[12px] m-0">Gold</Text>
                  </Column>
                </Row>
              </Section>

              {/* Item 3 - Phoenix */}
              <Section className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-[12px] p-[20px] mb-[16px] border border-solid border-yellow-200">
                <Row>
                  <Column className="w-1/6">
                    <Text className="text-[32px] m-0 text-center">🔥</Text>
                  </Column>
                  <Column className="w-1/2">
                    <Text className="text-orange-700 text-[18px] font-bold m-0 mb-[4px]">
                      Golden Phoenix Chick
                    </Text>
                    <Text className="text-gray-600 text-[12px] m-0 mb-[2px]">
                      Age: 2 months • Breed: Eternal Flame
                    </Text>
                    <Text className="text-gray-600 text-[12px] m-0 mb-[2px]">
                      Special: Rebirth cycle, golden feathers
                    </Text>
                    <Text className="text-gray-600 text-[12px] m-0">
                      Care Level: Master
                    </Text>
                  </Column>
                  <Column className="w-1/6 text-center">
                    <Text className="text-gray-600 text-[14px] m-0 mb-[4px]">Qty</Text>
                    <Text className="text-gray-800 text-[16px] font-bold m-0">1</Text>
                  </Column>
                  <Column className="w-1/6 text-right">
                    <Text className="text-orange-700 text-[18px] font-bold m-0">
                      2,800
                    </Text>
                    <Text className="text-gray-600 text-[12px] m-0">Gold</Text>
                  </Column>
                </Row>
              </Section>

              {/* Item 4 - Griffin */}
              <Section className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-[12px] p-[20px] mb-[24px] border border-solid border-amber-200">
                <Row>
                  <Column className="w-1/6">
                    <Text className="text-[32px] m-0 text-center">🦅</Text>
                  </Column>
                  <Column className="w-1/2">
                    <Text className="text-amber-700 text-[18px] font-bold m-0 mb-[4px]">
                      Noble Griffin Cub
                    </Text>
                    <Text className="text-gray-600 text-[12px] m-0 mb-[2px]">
                      Age: 8 months • Breed: Royal Goldwing
                    </Text>
                    <Text className="text-gray-600 text-[12px] m-0 mb-[2px]">
                      Special: Flight ready, loyal guardian
                    </Text>
                    <Text className="text-gray-600 text-[12px] m-0">
                      Care Level: Advanced
                    </Text>
                  </Column>
                  <Column className="w-1/6 text-center">
                    <Text className="text-gray-600 text-[14px] m-0 mb-[4px]">Qty</Text>
                    <Text className="text-gray-800 text-[16px] font-bold m-0">1</Text>
                  </Column>
                  <Column className="w-1/6 text-right">
                    <Text className="text-amber-700 text-[18px] font-bold m-0">
                      2,100
                    </Text>
                    <Text className="text-gray-600 text-[12px] m-0">Gold</Text>
                  </Column>
                </Row>
              </Section>

              <Hr className="border-purple-200 border-solid my-[24px]" />

              {/* Cart Summary */}
              <Section className="bg-purple-50 rounded-[12px] p-[24px] mb-[24px] border border-solid border-purple-200">
                <Row className="mb-[12px]">
                  <Column className="w-2/3">
                    <Text className="text-gray-600 text-[14px] m-0">Subtotal (4 creatures)</Text>
                  </Column>
                  <Column className="w-1/3 text-right">
                    <Text className="text-gray-800 text-[14px] m-0">9,600 Gold</Text>
                  </Column>
                </Row>
                <Row className="mb-[12px]">
                  <Column className="w-2/3">
                    <Text className="text-gray-600 text-[14px] m-0">Royal Delivery & Handling</Text>
                  </Column>
                  <Column className="w-1/3 text-right">
                    <Text className="text-gray-800 text-[14px] m-0">300 Gold</Text>
                  </Column>
                </Row>
                <Row className="mb-[12px]">
                  <Column className="w-2/3">
                    <Text className="text-gray-600 text-[14px] m-0">Magical Creature Insurance</Text>
                  </Column>
                  <Column className="w-1/3 text-right">
                    <Text className="text-gray-800 text-[14px] m-0">480 Gold</Text>
                  </Column>
                </Row>
                <Row className="mb-[12px]">
                  <Column className="w-2/3">
                    <Text className="text-green-600 text-[14px] m-0">Noble Discount (-10%)</Text>
                  </Column>
                  <Column className="w-1/3 text-right">
                    <Text className="text-green-600 text-[14px] m-0">-960 Gold</Text>
                  </Column>
                </Row>
                <Hr className="border-purple-300 border-solid my-[16px]" />
                <Row>
                  <Column className="w-2/3">
                    <Text className="text-purple-800 text-[20px] font-bold m-0">Total</Text>
                  </Column>
                  <Column className="w-1/3 text-right">
                    <Text className="text-purple-800 text-[24px] font-bold m-0">9,420</Text>
                    <Text className="text-purple-600 text-[14px] m-0">Gold Sovereigns</Text>
                  </Column>
                </Row>
              </Section>

              {/* Checkout Actions */}
              <Section className="text-center mb-[32px]">
                <Button
                  href="#"
                  className="bg-purple-700 text-white px-[40px] py-[16px] rounded-[8px] font-semibold text-[18px] no-underline box-border hover:bg-purple-800 mr-[12px]"
                >
                  🏰 Complete Purchase
                </Button>
                <Button
                  href="#"
                  className="bg-gray-200 text-gray-700 px-[32px] py-[16px] rounded-[8px] font-semibold text-[16px] no-underline box-border hover:bg-gray-300"
                >
                  📝 Save for Later
                </Button>
              </Section>
            </Section>

            <Hr className="border-purple-200 border-solid mx-[32px]" />

            {/* Care Package Offer */}
            <Section className="text-center bg-yellow-50 rounded-[8px] mx-[32px] p-[24px] mb-[32px] border border-solid border-yellow-200">
              <Text className="text-[18px] font-semibold text-purple-800 m-0 mb-[12px]">
                🎁 Add Royal Care Package?
              </Text>
              <Text className="text-gray-600 text-[14px] m-0 mb-[16px]">
                Get premium food, magical toys, and care guides for all your new companions.
                Perfect for first-time magical creature owners!
              </Text>
              <Text className="text-purple-700 text-[16px] font-bold m-0 mb-[16px]">
                Only 500 Gold (Save 200 Gold!)
              </Text>
              <Button
                href="#"
                className="bg-yellow-500 text-purple-900 px-[24px] py-[12px] rounded-[8px] font-semibold text-[14px] no-underline box-border hover:bg-yellow-400"
              >
                Add Care Package
              </Button>
            </Section>

            {/* Important Notes */}
            <Section className="px-[32px] py-[24px]">
              <Text className="text-purple-700 text-[16px] font-semibold m-0 mb-[16px] text-center">
                🌟 Important Creature Care Notes
              </Text>
              <Text className="text-gray-600 text-[12px] leading-relaxed m-0 mb-[8px]">
                • All creatures come with royal health certificates and magical lineage documentation
              </Text>
              <Text className="text-gray-600 text-[12px] leading-relaxed m-0 mb-[8px]">
                • Delivery includes secure magical transport cages and comfort items
              </Text>
              <Text className="text-gray-600 text-[12px] leading-relaxed m-0 mb-[8px]">
                • 30-day satisfaction guarantee with full creature whisperer support
              </Text>
              <Text className="text-gray-600 text-[12px] leading-relaxed m-0">
                • Royal veterinarian consultation included for first 90 days
              </Text>
            </Section>

            {/* Royal Footer */}
            <Section className="bg-gray-100 px-[32px] py-[24px] border-t border-solid border-purple-200">
              <Text className="text-center text-gray-500 text-[12px] m-0 mb-[16px]">
                📍 Royal Beastmart, Creature Quarter, Enchanted Realm 12345
              </Text>
              <Text className="text-center text-gray-500 text-[12px] m-0 mb-[8px]">
                Questions about your magical menagerie? Our creature experts are here to help!
              </Text>
              <Text className="text-center text-gray-500 text-[12px] m-0">
                <Link href="#" className="text-purple-600 no-underline">Creature Care Guide</Link> |
                <Link href="#" className="text-purple-600 no-underline ml-[8px]">Support</Link> |
                <Link href="#" className="text-purple-600 no-underline ml-[8px]">Track Order</Link>
              </Text>
              <Text className="text-center text-gray-400 text-[12px] m-0 mt-[16px]">
                © 2025 Royal Beastmart. All creatures ethically sourced.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

RoyalBeastmartCart.PreviewProps = {
  customerName: "Sir Gareth",
  cartId: "BEAST-2025-001",
  itemCount: "4",
};

export default RoyalBeastmartCart;