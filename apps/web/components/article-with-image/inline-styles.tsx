import { Button, Heading, Img, Section, Text } from '@react-email/components';
import { Layout } from '../_components/layout';

export const component = (
  <Section style={{ marginTop: 16, marginBottom: 16 }}>
    <Img
      alt="Herman Miller Chair"
      height="320"
      src="/static/herman-miller-chair.jpg"
      style={{
        width: '100%',
        borderRadius: 12,
        objectFit: 'cover',
      }}
    />
    <Section
      style={{
        marginTop: 32,
        textAlign: 'center',
      }}
    >
      <Text
        style={{
          marginTop: 16,
          marginBottom: 16,
          fontSize: 18,
          lineHeight: '28px',
          fontWeight: 600,
          color: 'rgb(79,70,229)',
        }}
      >
        Our new article
      </Text>
      <Heading
        as="h1"
        style={{
          margin: '0px',
          marginTop: 8,
          fontSize: 36,
          lineHeight: '36px',
          fontWeight: 600,
          color: 'rgb(17,24,39)',
        }}
      >
        Designing with Furniture
      </Heading>
      <Text
        style={{ fontSize: 16, lineHeight: '24px', color: 'rgb(107,114,128)' }}
      >
        Unleash your inner designer as we explore how furniture plays a vital
        role in creating stunning interiors, offering insights into choosing the
        right pieces, arranging them harmoniously, and infusing your space with
        personality.
      </Text>
      <Button
        href="https://react.email"
        style={{
          marginTop: 16,
          borderRadius: 8,
          backgroundColor: 'rgb(79,70,229)',
          paddingLeft: 40,
          paddingRight: 40,
          paddingTop: 12,
          paddingBottom: 12,
          fontWeight: 600,
          color: 'rgb(255,255,255)',
        }}
      >
        Read more
      </Button>
    </Section>
  </Section>
);

export default () => {
  return <Layout>{component}</Layout>;
};
