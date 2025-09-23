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

const RoyalStableInvoice = (props) => {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Body className="bg-gradient-to-b from-purple-900 to-indigo-900 font-sans py-[40px]">
          <Container className="bg-white max-w-[600px] mx-auto rounded-[12px] overflow-hidden shadow-2xl">
            {/* Royal Header */}
            <Section className="bg-gradient-to-r from-purple-800 to-indigo-800 text-center py-[32px] px-[24px]">
              <Text className="text-yellow-400 text-[48px] font-bold m-0 mb-[8px]">🐎</Text>
              <Heading className="text-red-500 text-[32px] font-bold m-0 mb-[8px] tracking-wide">
                ROYAL STABLES INVOICE
              </Heading>
              <Text className="text-red-500 text-[16px] m-0 italic">
                Premium Equestrian Services
              </Text>
            </Section>

            {/* Decorative Border */}
            <Section className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 h-[4px]"></Section>

            {/* Invoice Header */}
            <Section className="px-[32px] py-[32px]">
              <Row>
                <Column className="w-1/2">
                  <Text className="text-purple-800 text-[14px] font-semibold uppercase tracking-widest m-0 mb-[8px]">
                    Invoice From
                  </Text>
                  <Text className="text-gray-800 text-[16px] font-bold m-0 mb-[4px]">
                    Royal Stables of Camelot
                  </Text>
                  <Text className="text-gray-600 text-[14px] m-0 mb-[2px]">
                    Master Horseman Sir Edmund
                  </Text>
                  <Text className="text-gray-600 text-[14px] m-0 mb-[2px]">
                    Royal Stables Quarter
                  </Text>
                  <Text className="text-gray-600 text-[14px] m-0 mb-[2px]">
                    Kingdom Square, Enchanted Realm
                  </Text>
                  <Text className="text-gray-600 text-[14px] m-0">
                    Postal Code: 12345
                  </Text>
                </Column>
                <Column className="w-1/2 text-right">
                  <Text className="text-purple-800 text-[14px] font-semibold uppercase tracking-widest m-0 mb-[8px]">
                    Invoice Details
                  </Text>
                  <Text className="text-gray-800 text-[16px] font-bold m-0 mb-[4px]">
                    Invoice #RS-{props.invoiceNumber}
                  </Text>
                  <Text className="text-gray-600 text-[14px] m-0 mb-[2px]">
                    Date: {props.invoiceDate}
                  </Text>
                  <Text className="text-gray-600 text-[14px] m-0 mb-[2px]">
                    Due: {props.dueDate}
                  </Text>
                  <Text className="text-purple-700 text-[14px] font-semibold m-0">
                    Status: PAID ✅
                  </Text>
                </Column>
              </Row>
            </Section>

            <Hr className="border-purple-200 border-solid mx-[32px]" />

            {/* Customer Info */}
            <Section className="px-[32px] py-[24px]">
              <Text className="text-purple-800 text-[14px] font-semibold uppercase tracking-widest m-0 mb-[12px]">
                Sold To Noble Customer
              </Text>
              <Text className="text-gray-800 text-[16px] font-bold m-0 mb-[4px]">
                {props.customerName}
              </Text>
              <Text className="text-gray-600 text-[14px] m-0 mb-[2px]">
                {props.customerAddress}
              </Text>
              <Text className="text-gray-600 text-[14px] m-0">
                {props.customerEmail}
              </Text>
            </Section>

            <Hr className="border-purple-200 border-solid mx-[32px]" />

            {/* Horse Details */}
            <Section className="px-[32px] py-[32px]">
              <Heading className="text-purple-800 text-[24px] font-bold m-0 mb-[24px] text-center">
                🏇 Your Noble Steed
              </Heading>

              <Section className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-[12px] p-[24px] mb-[24px] border border-solid border-purple-200">
                <Row>
                  <Column className="w-2/3">
                    <Text className="text-purple-800 text-[20px] font-bold m-0 mb-[8px]">
                      {props.horseName} 🐴
                    </Text>
                    <Text className="text-gray-600 text-[14px] m-0 mb-[4px]">
                      <strong>Breed:</strong> {props.horseBreed}
                    </Text>
                    <Text className="text-gray-600 text-[14px] m-0 mb-[4px]">
                      <strong>Age:</strong> {props.horseAge} years old
                    </Text>
                    <Text className="text-gray-600 text-[14px] m-0 mb-[4px]">
                      <strong>Color:</strong> {props.horseColor}
                    </Text>
                    <Text className="text-gray-600 text-[14px] m-0 mb-[4px]">
                      <strong>Training:</strong> {props.horseTraining}
                    </Text>
                    <Text className="text-gray-600 text-[14px] m-0">
                      <strong>Pedigree:</strong> Royal Bloodline Certified
                    </Text>
                  </Column>
                  <Column className="w-1/3 text-right">
                    <Text className="text-purple-800 text-[32px] font-bold m-0">
                      {props.horsePrice}
                    </Text>
                    <Text className="text-gray-600 text-[14px] m-0">
                      Gold Sovereigns
                    </Text>
                  </Column>
                </Row>
              </Section>

              {/* Additional Services */}
              <Section className="mb-[24px]">
                <Text className="text-purple-700 text-[18px] font-semibold m-0 mb-[16px]">
                  ⚔️ Additional Royal Services
                </Text>

                <Row className="mb-[8px]">
                  <Column className="w-2/3">
                    <Text className="text-gray-600 text-[14px] m-0">Royal Saddle & Bridle Set</Text>
                  </Column>
                  <Column className="w-1/3 text-right">
                    <Text className="text-gray-600 text-[14px] m-0">150 Gold</Text>
                  </Column>
                </Row>

                <Row className="mb-[8px]">
                  <Column className="w-2/3">
                    <Text className="text-gray-600 text-[14px] m-0">Health Certificate & Veterinary Check</Text>
                  </Column>
                  <Column className="w-1/3 text-right">
                    <Text className="text-gray-600 text-[14px] m-0">75 Gold</Text>
                  </Column>
                </Row>

                <Row className="mb-[8px]">
                  <Column className="w-2/3">
                    <Text className="text-gray-600 text-[14px] m-0">Royal Delivery to Your Castle</Text>
                  </Column>
                  <Column className="w-1/3 text-right">
                    <Text className="text-gray-600 text-[14px] m-0">100 Gold</Text>
                  </Column>
                </Row>

                <Row className="mb-[8px]">
                  <Column className="w-2/3">
                    <Text className="text-gray-600 text-[14px] m-0">30-Day Care Instructions Scroll</Text>
                  </Column>
                  <Column className="w-1/3 text-right">
                    <Text className="text-gray-600 text-[14px] m-0">25 Gold</Text>
                  </Column>
                </Row>
              </Section>

              <Hr className="border-purple-200 border-solid my-[24px]" />

              {/* Total */}
              <Row className="bg-purple-100 rounded-[8px] p-[16px]">
                <Column className="w-2/3">
                  <Text className="text-purple-800 text-[20px] font-bold m-0">
                    Total Amount Due
                  </Text>
                </Column>
                <Column className="w-1/3 text-right">
                  <Text className="text-purple-800 text-[24px] font-bold m-0">
                    {props.totalAmount}
                  </Text>
                  <Text className="text-purple-600 text-[14px] m-0">
                    Gold Sovereigns
                  </Text>
                </Column>
              </Row>
            </Section>

            <Hr className="border-purple-200 border-solid mx-[32px]" />

            {/* Care Instructions */}
            <Section className="px-[32px] py-[24px]">
              <Text className="text-purple-700 text-[18px] font-semibold m-0 mb-[16px] text-center">
                🌟 Royal Care Instructions
              </Text>
              <Text className="text-gray-600 text-[14px] leading-relaxed m-0 mb-[12px]">
                • Your noble steed has been blessed by the court wizard for good fortune
              </Text>
              <Text className="text-gray-600 text-[14px] leading-relaxed m-0 mb-[12px]">
                • Feed only the finest oats and hay from the royal granaries
              </Text>
              <Text className="text-gray-600 text-[14px] leading-relaxed m-0 mb-[12px]">
                • Exercise daily in open fields for optimal health and happiness
              </Text>
              <Text className="text-gray-600 text-[14px] leading-relaxed m-0">
                • Contact our stable masters for any questions or concerns
              </Text>
            </Section>

            {/* Contact & Support */}
            <Section className="text-center bg-yellow-50 rounded-[8px] mx-[32px] p-[24px] mb-[32px] border border-solid border-yellow-200">
              <Text className="text-[16px] font-semibold text-purple-800 m-0 mb-[12px]">
                🤝 Need Assistance with Your Steed?
              </Text>
              <Text className="text-gray-600 text-[14px] m-0 mb-[16px]">
                Our master horsemen are available for training, care advice, and any equestrian needs.
              </Text>
              <Button
                href="#"
                className="bg-purple-700 text-white px-[24px] py-[12px] rounded-[8px] font-semibold text-[14px] no-underline box-border hover:bg-purple-800"
              >
                Contact Stable Masters
              </Button>
            </Section>

            {/* Royal Footer */}
            <Section className="bg-gray-100 px-[32px] py-[24px] border-t border-solid border-purple-200">
              <Text className="text-center text-gray-500 text-[12px] m-0 mb-[16px]">
                📍 Royal Stables Quarter, Kingdom Square, Enchanted Realm 12345
              </Text>
              <Text className="text-center text-gray-500 text-[12px] m-0 mb-[8px]">
                Thank you for choosing the Royal Stables for your equestrian needs.
              </Text>
              <Text className="text-center text-gray-500 text-[12px] m-0">
                <Link href="#" className="text-purple-600 no-underline">Stable Services</Link> |
                <Link href="#" className="text-purple-600 no-underline ml-[8px]">Horse Care Guide</Link> |
                <Link href="#" className="text-purple-600 no-underline ml-[8px]">Contact Support</Link>
              </Text>
              <Text className="text-center text-gray-400 text-[12px] m-0 mt-[16px]">
                © 2025 Royal Stables of Camelot. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

RoyalStableInvoice.PreviewProps = {
  invoiceNumber: "2025-001",
  invoiceDate: "January 15, 2025",
  dueDate: "January 30, 2025",
  customerName: "Sir Lancelot of the Lake",
  customerAddress: "Castle Joyous Gard, Northern Kingdom",
  customerEmail: "lancelot@roundtable.kingdom",
  horseName: "Thunderbolt",
  horseBreed: "Royal Destrier",
  horseAge: "5",
  horseColor: "Majestic Black",
  horseTraining: "War-trained & Noble Riding",
  horsePrice: "2,500",
  totalAmount: "2,850",
};

export default RoyalStableInvoice;