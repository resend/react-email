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
      <Container className="mx-auto max-w-[400px] rounded-lg bg-white px-[42px] py-[24px]">
        <Section>
          <Heading as="h1" className="text-2xl leading-8">
            Customer Reviews
          </Heading>
          <div className="mt-3 flex flex-col">
            <Text className="hidden">4 out of 5 stars</Text>
          </div>
          <Section className="my-6">
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
                  className="flex items-center text-sm leading-5"
                >
                  <dt className="flex flex-1 items-center">
                    <Text className="w-3 font-medium text-gray-500">
                      {count.rating}
                      <span className="hidden"> star reviews</span>
                    </Text>
                    <div
                      aria-hidden="true"
                      className="ml-1 flex flex-1 items-center"
                    >
                      <div className="relative ml-3 flex-1">
                        <div className="h-3 rounded-md border border-gray-200 bg-gray-100" />
                        {count.count > 0 && (
                          <div
                            className="absolute top-0 bottom-0 rounded-md bg-indigo-600"
                            style={{
                              width: `calc(${count.count} / ${1624} * 100%)`,
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </dt>
                  <dd className="ml-3 text-right font-medium text-gray-500 text-xs tabular-nums leading-none">
                    {Math.round((count.count / 1624) * 100)}%
                  </dd>
                </div>
              ))}
            </dl>
            <Text className="mt-[14px] text-center text-gray-500 text-xs leading-6">
              Based on <span className="font-semibold">1624</span> Reviews
            </Text>
          </Section>
          <Hr />
          <Section className="mt-[30px]">
            <Heading
              as="h3"
              className="mb-3 font-medium text-gray-900 text-lg leading-6"
            >
              Share your thoughts
            </Heading>
            <Text className="m-0 text-gray-500 text-sm leading-5">
              If you’ve used this product, share your thoughts with other
              customers
            </Text>
            <Button
              href="#"
              className="mt-[26px] mb-[24px] inline-block w-full rounded-lg bg-indigo-600 p-3 text-center font-semibold text-white"
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
