import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

interface ChangelogProps {
  receiver: string;
  changes: Partial<Record<'features' | 'fixes' | 'improvements', string[]>>;
  date: string;
}

interface ChangesProps {
  title: React.ReactNode;
  content: string[];
}

function Changes({ title, content }: ChangesProps) {
  return (
    <Section>
      <Heading as="h2" className="my-[12px]">
        {title}
      </Heading>
      <ul className="list-disc pl-6">
        {content.map((feature, index) => (
          <li key={index} className="mb-2">
            {feature}
          </li>
        ))}
      </ul>
    </Section>
  );
}

export default function Changelog({ receiver, date, changes }: ChangelogProps) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-black text-white">
          <Preview>
            The changes as of {date} particularly tailored to you
          </Preview>
          <Container className="mx-auto">
            <Heading className="font-bold text-center my-[48px] text-[32px]">
              Hello {receiver},
            </Heading>
            <Text>
              We've been hard at work making improvements to our service, and we
              wanted to share the latest changes as of{' '}
              <span className="font-bold">{date}</span> with you.
            </Text>
            {changes.features && changes.features.length > 0 ? (
              <Changes title="Features" content={changes.features} />
            ) : null}
            {changes.improvements && changes.improvements.length > 0 ? (
              <Changes title="Improvements" content={changes.improvements} />
            ) : null}
            {changes.fixes && changes.fixes.length > 0 ? (
              <Changes title="Fixes" content={changes.fixes} />
            ) : null}
            <Text className="mt-6">- React Email team</Text>
            <Hr style={{ borderTopColor: '#404040' }} />
            <Text className="text-[#606060] font-bold">
              React Email, 999 React St, Email City, EC 12345
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

Changelog.PreviewProps = {
  receiver: 'user',
  changes: {
    features: [
      'Added a new feature to enhance user experience',
      'Introduced a dark mode option for better accessibility',
    ],
    fixes: [
      'Fixed a bug that caused the app to crash on startup',
      'Resolved an issue with email notifications not being sent',
    ],
    improvements: [
      'Improved performance of the application by optimizing database queries',
      'Enhanced security measures to protect user data',
    ],
  },
  date: 'June 4th, 2025',
} satisfies ChangelogProps;
