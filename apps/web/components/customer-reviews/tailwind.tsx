import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Html>
    <Head />
    <Preview>Customer Reviews</Preview>
    <Body>
      <Container className="mx-auto max-w-[400px] rounded-[8px] bg-white px-[42px] py-[24px]">
        <Section>
          <Heading as="h1" className="text-[24px] leading-[32px]">
            Customer Reviews
          </Heading>
          <div className="mt-[12px] flex flex-col">
            <Text className="hidden">4 out of 5 stars</Text>
          </div>
          <Section className="my-[24px]">
            <Heading as="h2" className="hidden">
              Review data
            </Heading>
            <dl className="m-0">
              {[
                { rating: 5, count: 1019 },
                { rating: 4, count: 162 },
                { rating: 3, count: 97 },
                { rating: 2, count: 199 },
                { rating: 1, count: 147 },
              ].map((count) => (
                <div
                  key={count.rating}
                  className="flex items-center text-[14px] leading-[20px]"
                >
                  <dt className="flex flex-1 items-center">
                    <Text className="w-[12px] font-medium text-gray-500">
                      {count.rating}
                      <span className="hidden"> star reviews</span>
                    </Text>
                    <div
                      aria-hidden="true"
                      className="ml-[4px] flex flex-1 items-center"
                    >
                      <div className="relative ml-[12px] flex-1">
                        <div className="h-[12px] rounded-[6px] border border-gray-200 bg-gray-100" />
                        {count.count > 0 && (
                          <div
                            className="absolute top-0 bottom-0 rounded-[6px] bg-indigo-600"
                            style={{
                              width: `calc(${count.count} / ${1624} * 100%)`,
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </dt>
                  <dd className="ml-[12px] text-right font-medium text-gray-500 text-[12px] [font-variant-numeric:tabular-nums] leading-none">
                    {Math.round((count.count / 1624) * 100)}%
                  </dd>
                </div>
              ))}
            </dl>
            <Text className="mt-[14px] text-center text-gray-500 text-[12px] leading-[24px]">
              Based on <span className="font-semibold">1624</span> Reviews
            </Text>
          </Section>
          <Hr />
          <Section className="mt-[30px]">
            <Heading
              as="h3"
              className="mb-[12px] font-medium text-gray-900 text-[18px] leading-[24px]"
            >
              Share your thoughts
            </Heading>
            <Text className="m-0 text-gray-500 text-[14px] leading-[20px]">
              If you’ve used this product, share your thoughts with other
              customers
            </Text>
            <Button
              href="#"
              className="mt-[26px] mb-[24px] inline-block w-full rounded-[8px] bg-indigo-600 p-[12px] text-center box-border font-semibold text-white"
            >
              Write a review
            </Button>
          </Section>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default () => {
  return <Layout>{component}</Layout>;
};
