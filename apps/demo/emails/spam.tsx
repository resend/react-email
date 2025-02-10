import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Button,
} from '@react-email/components';

const SpamEmailTemplate = () => {
  return (
    <Html>
      <Head />
      <Body
        style={{ margin: '0', padding: '0', fontFamily: 'Arial, sans-serif' }}
      >
        <Preview>Congratulations! You've won a FREE gift card!!!</Preview>
        <Container style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
          <Section>
            <Text
              style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff0000' }}
            >
              YOU'VE WON!!! 🎉
            </Text>
            <Text style={{ fontSize: '16px', margin: '10px 0' }}>
              Dear Lucky Winner,
            </Text>
            <Text style={{ fontSize: '16px', margin: '10px 0' }}>
              Click the link below to claim your FREE $1000 GIFT CARD!!! This is
              a once-in-a-lifetime opportunity!!! Don't miss out!!!
            </Text>
            <Button
              href="http://example.com"
              style={{
                backgroundColor: '#ffcc00',
                color: '#000',
                padding: '10px 20px',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              CLAIM YOUR PRIZE NOW!!!
            </Button>
            <Text style={{ fontSize: '12px', margin: '20px 0', color: '#888' }}>
              This is not a scam!!! We promise!!! You can trust us!!!
              Unsubscribe here if you don't want to receive more emails like
              this.
            </Text>
            <Text style={{ fontSize: '12px', margin: '20px 0', color: '#888' }}>
              This email is spam. We sell rolexss for cheap. Get your viagra. We
              also sell weight loss pills today. Money back guaranteed. sEnd me
              $500 and I'll send you back $700. don't tell anyone. Send this
              email to ten friends
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default SpamEmailTemplate;
