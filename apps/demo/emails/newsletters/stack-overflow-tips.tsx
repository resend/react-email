import {
  Body,
  Column,
  Container,
  Head,
  Heading,
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

interface StackOverflowTipsEmailProps {
  tips?: { id: number; description: string }[];
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

const PropDefaults: StackOverflowTipsEmailProps = {
  tips: [
    {
      id: 1,
      description:
        'To find a specific phrase, enter it in quotes: "local storage"',
    },
    {
      id: 1,
      description:
        'To search within specific tag(s), enter them in square brackets: [javascript]',
    },
    {
      id: 1,
      description:
        'Combine them to get even more precise results - [javascript] "local storage" searches for the phrase “local storage” in questions that have the [javascript] tag',
    },
  ],
};

export const StackOverflowTipsEmail = ({
  tips = [],
}: StackOverflowTipsEmailProps) => (
  <Html>
    <Head />
    <Tailwind config={tailwindConfig}>
      <Body className="bg-[#f3f3f5] font-stack-overflow">
        <Preview>Stack overflow tips for searching</Preview>
        <Container className="w-[680px] max-w-full mx-auto bg-white">
          <Section className="flex bg-[#f3f3f5] p-5 px-8">
            <Img
              width={146}
              src={`${baseUrl}/static/stack-overflow-logo.png`}
            />
          </Section>

          <Section className="rounded-t-md flex flex-col bg-[#2b2d6e]">
            <Row>
              <Column className="py-5 px-8 pb-4">
                <Heading className="text-white text-3xl font-bold leading-tight">
                  Find what you want, faster
                </Heading>
                <Text className="text-white text-lg">
                  Tips and tricks for searching on Stack Overflow
                </Text>
              </Column>
              <Column className="py-8 px-3">
                <Img
                  className="max-w-full"
                  width={340}
                  src={`${baseUrl}/static/stack-overflow-header.png`}
                />
              </Column>
            </Row>
          </Section>

          <Section className="py-8 px-8 pb-10">
            <Heading
              as="h2"
              className="mb-4 font-bold text-xl leading-tight text-[#0c0d0e]"
            >
              Searching for solutions
            </Heading>
            <Text className="text-base leading-6 text-[#3c3f44]">
              With more than 18 million questions, it's possible that someone
              has already provided a solution to the problem you're facing.{' '}
            </Text>

            <Hr className="my-8" />

            <Heading
              as="h2"
              className="mb-4 font-bold text-xl leading-tight text-[#0c0d0e]"
            >
              Use the search bar at the top of the page to find what you need
            </Heading>
            <Text className="text-base leading-6 text-[#3c3f44]">
              Here are a few simple search tips to get you started:
            </Text>
            <ul>
              {tips.map((tip) => (
                <li key={tip.id}>
                  <Text className="text-base leading-6 text-[#3c3f44]">
                    {tip.description}
                  </Text>
                </li>
              ))}
            </ul>

            <Text className="text-base leading-6 text-[#3c3f44]">
              The more information you can put in the search bar, the more
              likely you will be to either find the answer you need or feel
              confident that no one else has asked the question before.
            </Text>

            <Hr className="my-8" />

            <Heading
              as="h2"
              className="mb-4 font-bold text-xl leading-tight text-[#0c0d0e]"
            >
              Take a break and read about the worst coder in the world
            </Heading>

            <Section className="mt-6 block">
              <Link
                className="bg-[#0095ff] border border-[#0077cc] text-lg leading-tight py-3 px-4 rounded max-w-[120px] text-white"
                href="https://stackoverflow.blog/2019/10/22/"
              >
                I need a break
              </Link>
            </Section>
          </Section>
        </Container>

        <Section className="w-[680px] max-w-full mt-8 mx-auto px-8">
          <Text className="text-xs leading-4 text-[#9199a1] m-0">
            You're receiving this email because your Stack Overflow activity
            triggered this tip or reminder.
          </Text>

          <Link
            href="/"
            className="inline-block text-[#9199a1] underline text-xs mr-3 mb-0 mt-2"
          >
            Unsubscribe from emails like this{' '}
          </Link>
          <Link
            href="/"
            className="inline-block text-[#9199a1] underline text-xs mr-3 mb-0 mt-2"
          >
            Edit email settings{' '}
          </Link>
          <Link
            href="/"
            className="inline-block text-[#9199a1] underline text-xs mr-3 mb-0 mt-2"
          >
            Contact us
          </Link>
          <Link
            href="/"
            className="inline-block text-[#9199a1] underline text-xs mr-3 mb-0 mt-2"
          >
            Privacy
          </Link>

          <Hr className="my-8 border-[#d6d8db]" />

          <Img
            width={111}
            src={`${baseUrl}/static/stack-overflow-logo-sm.png`}
          />
          <Text className="my-1 text-xs leading-4 text-[#9199a1]">
            <strong>Stack Overflow</strong>, 110 William Street, 28th Floor, New
            York, NY 10038
          </Text>
          <Text className="rounded-sm border border-[#d6d9dc] py-1 px-1.5 text-xs leading-3 font-stack-overflow-mono text-[#e06c77] max-w-min m-0 mb-8">
            {'<3'}
          </Text>
        </Section>
      </Body>
    </Tailwind>
  </Html>
);

StackOverflowTipsEmail.PreviewProps = {
  tips: PropDefaults.tips,
} as StackOverflowTipsEmailProps;

export default StackOverflowTipsEmail;
