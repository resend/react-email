import { Button, Heading, Img, Section, Text } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Section style={{ marginTop: 16, marginBottom: 16 }}>
    <Img
      alt="Braun Collection"
      height={320}
      src="/static/braun-collection.jpg"
      style={{
        width: '100%',
        borderRadius: 12,
        objectFit: 'cover',
      }}
    />
    <Section style={{ marginTop: 32, textAlign: 'center' }}>
      <Text
        style={{
          marginTop: 16,
          fontSize: 18,
          lineHeight: '28px',
          fontWeight: 600,
          color: 'rgb(79,70,229)',
        }}
      >
        Classic Watches
      </Text>
      <Heading
        as="h1"
        style={{
          fontSize: 36,
          lineHeight: '40px',
          fontWeight: 600,
          letterSpacing: 0.4,
          color: 'rgb(17,24,39)',
        }}
      >
        Elegant Comfort
      </Heading>
      <Text
        style={{
          marginTop: 8,
          fontSize: 16,
          lineHeight: '24px',
          color: 'rgb(107,114,128)',
        }}
      >
        Dieter Rams’ work has an outstanding quality which distinguishes it from
        the vast majority of industrial design of the entire 20th Century.
      </Text>
      <Text
        style={{
          fontSize: 16,
          lineHeight: '24px',
          fontWeight: 600,
          color: 'rgb(17,24,39)',
        }}
      >
        $210.00
      </Text>
      <Button
        href="https://react.email"
        style={{
          marginTop: 16,
          borderRadius: 8,
          backgroundColor: 'rgb(79,70,229)',
          paddingLeft: 24,
          paddingRight: 24,
          paddingTop: 12,
          paddingBottom: 12,
          fontWeight: 600,
          color: 'rgb(255,255,255)',
        }}
      >
        Buy now
      </Button>
    </Section>
  </Section>
);

export default () => {
  return <Layout>{component}</Layout>;
};
