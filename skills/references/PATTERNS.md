# Common Email Patterns

Real-world examples of common email templates using React Email.

## Password Reset Email

```tsx
import { Html, Head, Preview, Body, Container, Heading, Text, Button, Hr } from '@react-email/components';

interface PasswordResetProps {
  resetUrl: string;
  email: string;
  expiryHours?: number;
}

export default function PasswordReset({ resetUrl, email, expiryHours = 1 }: PasswordResetProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Reset your password - Action required</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Reset Your Password</Heading>
          <Text style={text}>
            A password reset was requested for your account: <strong>{email}</strong>
          </Text>
          <Text style={text}>
            Click the button below to reset your password. This link expires in {expiryHours} hour{expiryHours > 1 ? 's' : ''}.
          </Text>
          <Button href={resetUrl} style={button}>
            Reset Password
          </Button>
          <Hr style={hr} />
          <Text style={footer}>
            If you didn't request this, please ignore this email. Your password will remain unchanged.
          </Text>
          <Text style={footer}>
            For security, this link will only work once.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

PasswordReset.PreviewProps = {
  resetUrl: 'https://example.com/reset/abc123',
  email: 'user@example.com',
  expiryHours: 1
} as PasswordResetProps;

const main = { backgroundColor: '#f6f9fc', fontFamily: 'Arial, sans-serif' };
const container = { margin: '0 auto', padding: '40px 20px', maxWidth: '560px', backgroundColor: '#ffffff' };
const h1 = { fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '20px' };
const text = { fontSize: '16px', lineHeight: '26px', color: '#333', margin: '16px 0' };
const button = {
  backgroundColor: '#dc3545',
  color: '#fff',
  padding: '14px 28px',
  borderRadius: '4px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  fontWeight: 'bold',
  margin: '24px 0'
};
const hr = { borderColor: '#e6ebf1', margin: '24px 0' };
const footer = { fontSize: '14px', color: '#8898aa', lineHeight: '20px', margin: '8px 0' };
```

## Order Confirmation with Product List

```tsx
import { 
  Html, Head, Preview, Body, Container, Section, Row, Column, 
  Heading, Text, Img, Hr 
} from '@react-email/components';

interface Product {
  name: string;
  price: number;
  quantity: number;
  image: string;
  sku?: string;
}

interface OrderConfirmationProps {
  orderNumber: string;
  orderDate: Date;
  items: Product[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

export default function OrderConfirmation({
  orderNumber,
  orderDate,
  items,
  subtotal,
  shipping,
  tax,
  total,
  shippingAddress
}: OrderConfirmationProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Order #{orderNumber} confirmed - Thank you for your purchase!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Order Confirmed</Heading>
          <Text style={text}>Thank you for your order!</Text>
          
          <Section style={infoSection}>
            <Row>
              <Column>
                <Text style={label}>Order Number</Text>
                <Text style={value}>#{orderNumber}</Text>
              </Column>
              <Column>
                <Text style={label}>Order Date</Text>
                <Text style={value}>{orderDate.toLocaleDateString()}</Text>
              </Column>
            </Row>
          </Section>

          <Hr style={hr} />

          <Heading as="h2" style={h2}>Order Items</Heading>
          
          {items.map((item, index) => (
            <Section key={index} style={productSection}>
              <Row>
                <Column style={{ width: '80px', verticalAlign: 'top' }}>
                  <Img 
                    src={item.image} 
                    alt={item.name}
                    width="80" 
                    height="80"
                    style={productImage}
                  />
                </Column>
                <Column style={{ verticalAlign: 'top', paddingLeft: '16px' }}>
                  <Text style={productName}>{item.name}</Text>
                  {item.sku && <Text style={productSku}>SKU: {item.sku}</Text>}
                  <Text style={productDetails}>
                    Quantity: {item.quantity} × ${item.price.toFixed(2)}
                  </Text>
                </Column>
                <Column style={{ width: '100px', textAlign: 'right', verticalAlign: 'top' }}>
                  <Text style={productPrice}>
                    ${(item.quantity * item.price).toFixed(2)}
                  </Text>
                </Column>
              </Row>
            </Section>
          ))}

          <Hr style={hr} />

          <Section style={totalsSection}>
            <Row>
              <Column><Text style={totalsLabel}>Subtotal</Text></Column>
              <Column style={{ textAlign: 'right' }}>
                <Text style={totalsValue}>${subtotal.toFixed(2)}</Text>
              </Column>
            </Row>
            <Row>
              <Column><Text style={totalsLabel}>Shipping</Text></Column>
              <Column style={{ textAlign: 'right' }}>
                <Text style={totalsValue}>${shipping.toFixed(2)}</Text>
              </Column>
            </Row>
            <Row>
              <Column><Text style={totalsLabel}>Tax</Text></Column>
              <Column style={{ textAlign: 'right' }}>
                <Text style={totalsValue}>${tax.toFixed(2)}</Text>
              </Column>
            </Row>
            <Hr style={thinHr} />
            <Row>
              <Column><Text style={totalLabel}>Total</Text></Column>
              <Column style={{ textAlign: 'right' }}>
                <Text style={totalValue}>${total.toFixed(2)}</Text>
              </Column>
            </Row>
          </Section>

          <Hr style={hr} />

          <Heading as="h2" style={h2}>Shipping Address</Heading>
          <Section style={addressSection}>
            <Text style={addressText}>{shippingAddress.name}</Text>
            <Text style={addressText}>{shippingAddress.street}</Text>
            <Text style={addressText}>
              {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}
            </Text>
            <Text style={addressText}>{shippingAddress.country}</Text>
          </Section>

          <Text style={footer}>
            Questions about your order? Reply to this email and we'll help you out.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

OrderConfirmation.PreviewProps = {
  orderNumber: '10234',
  orderDate: new Date(),
  items: [
    {
      name: 'Vintage Macintosh',
      price: 499.00,
      quantity: 1,
      image: 'https://via.placeholder.com/80',
      sku: 'MAC-001'
    },
    {
      name: 'Mechanical Keyboard',
      price: 149.99,
      quantity: 2,
      image: 'https://via.placeholder.com/80',
      sku: 'KEY-042'
    }
  ],
  subtotal: 798.98,
  shipping: 15.00,
  tax: 69.42,
  total: 883.40,
  shippingAddress: {
    name: 'John Doe',
    street: '123 Main St',
    city: 'San Francisco',
    state: 'CA',
    zip: '94102',
    country: 'USA'
  }
} as OrderConfirmationProps;

const main = { backgroundColor: '#f6f9fc', fontFamily: 'Arial, sans-serif' };
const container = { margin: '0 auto', padding: '40px 20px', maxWidth: '600px' };
const h1 = { fontSize: '28px', fontWeight: 'bold', color: '#333', marginBottom: '8px' };
const h2 = { fontSize: '20px', fontWeight: 'bold', color: '#333', margin: '24px 0 16px 0' };
const text = { fontSize: '16px', color: '#666', marginBottom: '24px' };
const infoSection = { backgroundColor: '#f8f9fa', padding: '16px', borderRadius: '4px', marginBottom: '24px' };
const label = { fontSize: '12px', color: '#666', textTransform: 'uppercase' as const, marginBottom: '4px' };
const value = { fontSize: '16px', fontWeight: 'bold', color: '#333', margin: '0' };
const hr = { borderColor: '#e6ebf1', margin: '24px 0' };
const thinHr = { borderColor: '#e6ebf1', margin: '12px 0' };
const productSection = { marginBottom: '16px' };
const productImage = { borderRadius: '4px', border: '1px solid #e6ebf1' };
const productName = { fontSize: '16px', fontWeight: 'bold', color: '#333', margin: '0 0 4px 0' };
const productSku = { fontSize: '14px', color: '#999', margin: '0 0 8px 0' };
const productDetails = { fontSize: '14px', color: '#666', margin: '0' };
const productPrice = { fontSize: '16px', fontWeight: 'bold', color: '#333', margin: '0' };
const totalsSection = { marginTop: '24px' };
const totalsLabel = { fontSize: '14px', color: '#666', margin: '8px 0' };
const totalsValue = { fontSize: '14px', color: '#333', margin: '8px 0' };
const totalLabel = { fontSize: '18px', fontWeight: 'bold', color: '#333', margin: '8px 0' };
const totalValue = { fontSize: '18px', fontWeight: 'bold', color: '#333', margin: '8px 0' };
const addressSection = { backgroundColor: '#f8f9fa', padding: '16px', borderRadius: '4px' };
const addressText = { fontSize: '14px', color: '#333', margin: '4px 0' };
const footer = { fontSize: '14px', color: '#8898aa', marginTop: '32px' };
```

## Notification Email with Code Block

```tsx
import { 
  Html, Head, Preview, Body, Container, Heading, Text, 
  CodeBlock, dracula, Hr, Link 
} from '@react-email/components';

interface NotificationProps {
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'success';
  timestamp: Date;
  logData?: string;
  actionUrl?: string;
  actionLabel?: string;
}

export default function Notification({
  title,
  message,
  severity,
  timestamp,
  logData,
  actionUrl,
  actionLabel = 'View Details'
}: NotificationProps) {
  const severityColors = {
    info: '#0ea5e9',
    warning: '#f59e0b',
    error: '#ef4444',
    success: '#22c55e'
  };

  const severityColor = severityColors[severity];

  return (
    <Html lang="en">
      <Head />
      <Preview>{title} - {severity}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={{ ...statusBar, backgroundColor: severityColor }} />
          
          <Heading style={h1}>{title}</Heading>
          
          <Text style={{ ...badge, backgroundColor: severityColor }}>
            {severity.toUpperCase()}
          </Text>
          
          <Text style={text}>{message}</Text>
          
          <Text style={timestamp}>
            {new Date(timestamp).toLocaleString('en-US', {
              dateStyle: 'long',
              timeStyle: 'short'
            })}
          </Text>

          {logData && (
            <>
              <Hr style={hr} />
              <Heading as="h2" style={h2}>Log Details</Heading>
              <CodeBlock
                code={logData}
                language="json"
                theme={dracula}
                lineNumbers
                style={codeBlock}
              />
            </>
          )}

          {actionUrl && (
            <>
              <Hr style={hr} />
              <Link href={actionUrl} style={{ ...button, backgroundColor: severityColor }}>
                {actionLabel}
              </Link>
            </>
          )}

          <Hr style={hr} />
          <Text style={footer}>
            This is an automated notification. Please do not reply to this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

Notification.PreviewProps = {
  title: 'Deployment Failed',
  message: 'The deployment to production environment has failed. Please review the logs and take corrective action.',
  severity: 'error',
  timestamp: new Date(),
  logData: `{
  "error": "Build failed",
  "exit_code": 1,
  "duration": "2m 34s",
  "commit": "abc123def"
}`,
  actionUrl: 'https://example.com/deployments/123',
  actionLabel: 'View Deployment'
} as NotificationProps;

const main = { backgroundColor: '#f6f9fc', fontFamily: 'monospace, Arial, sans-serif' };
const container = { 
  margin: '0 auto', 
  padding: '0',
  maxWidth: '600px',
  backgroundColor: '#ffffff',
  border: '1px solid #e6ebf1',
  borderRadius: '4px',
  overflow: 'hidden'
};
const statusBar = { height: '4px', width: '100%' };
const h1 = { fontSize: '24px', fontWeight: 'bold', color: '#333', margin: '24px 24px 16px 24px' };
const h2 = { fontSize: '18px', fontWeight: 'bold', color: '#333', margin: '16px 24px' };
const badge = {
  display: 'inline-block',
  padding: '4px 12px',
  fontSize: '12px',
  fontWeight: 'bold',
  color: '#fff',
  borderRadius: '12px',
  marginLeft: '24px',
  marginBottom: '16px'
};
const text = { fontSize: '16px', lineHeight: '24px', color: '#333', margin: '0 24px 16px 24px' };
const timestamp = { fontSize: '14px', color: '#666', margin: '0 24px 24px 24px' };
const hr = { borderColor: '#e6ebf1', margin: '24px 0' };
const codeBlock = { margin: '0 24px' };
const button = {
  display: 'inline-block',
  padding: '12px 24px',
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#fff',
  textDecoration: 'none',
  borderRadius: '4px',
  margin: '0 24px 24px 24px'
};
const footer = { fontSize: '12px', color: '#8898aa', margin: '0 24px 24px 24px' };

// Need to define Section for this example
const Section = ({ children, style }: { children?: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={style}>{children}</div>
);
```

## Multi-Column Newsletter

```tsx
import { 
  Html, Head, Preview, Body, Container, Section, Row, Column, 
  Heading, Text, Img, Button, Hr, Link 
} from '@react-email/components';

interface Article {
  title: string;
  excerpt: string;
  image: string;
  url: string;
  author: string;
  date: string;
}

interface NewsletterProps {
  articles: Article[];
  unsubscribeUrl: string;
}

export default function Newsletter({ articles, unsubscribeUrl }: NewsletterProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Your weekly roundup of the latest articles</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img 
              src="https://via.placeholder.com/150x50?text=Logo" 
              alt="Company Logo"
              width="150"
              height="50"
            />
          </Section>

          <Heading style={h1}>This Week's Highlights</Heading>
          <Text style={intro}>
            Here are the top articles from this week. Enjoy your reading!
          </Text>

          <Hr style={hr} />

          {/* Featured Article */}
          {articles[0] && (
            <Section style={featuredSection}>
              <Img 
                src={articles[0].image} 
                alt={articles[0].title}
                width="600"
                style={featuredImage}
              />
              <Heading as="h2" style={h2}>{articles[0].title}</Heading>
              <Text style={excerpt}>{articles[0].excerpt}</Text>
              <Text style={meta}>
                By {articles[0].author} • {articles[0].date}
              </Text>
              <Button href={articles[0].url} style={button}>
                Read More
              </Button>
            </Section>
          )}

          <Hr style={hr} />

          {/* Two-Column Articles */}
          {articles.slice(1, 5).length > 0 && (
            <>
              <Heading as="h2" style={h2}>More From This Week</Heading>
              {Array.from({ length: Math.ceil(articles.slice(1, 5).length / 2) }).map((_, rowIndex) => {
                const leftArticle = articles[1 + rowIndex * 2];
                const rightArticle = articles[2 + rowIndex * 2];
                
                return (
                  <Section key={rowIndex} style={articleRow}>
                    <Row>
                      {leftArticle && (
                        <Column style={articleColumn}>
                          <Img 
                            src={leftArticle.image} 
                            alt={leftArticle.title}
                            width="280"
                            style={articleImage}
                          />
                          <Heading as="h3" style={h3}>{leftArticle.title}</Heading>
                          <Text style={articleExcerpt}>{leftArticle.excerpt}</Text>
                          <Link href={leftArticle.url} style={link}>
                            Read article →
                          </Link>
                        </Column>
                      )}
                      
                      {rightArticle && (
                        <Column style={articleColumn}>
                          <Img 
                            src={rightArticle.image} 
                            alt={rightArticle.title}
                            width="280"
                            style={articleImage}
                          />
                          <Heading as="h3" style={h3}>{rightArticle.title}</Heading>
                          <Text style={articleExcerpt}>{rightArticle.excerpt}</Text>
                          <Link href={rightArticle.url} style={link}>
                            Read article →
                          </Link>
                        </Column>
                      )}
                    </Row>
                  </Section>
                );
              })}
            </>
          )}

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              You're receiving this because you subscribed to our newsletter.
            </Text>
            <Link href={unsubscribeUrl} style={unsubscribeLink}>
              Unsubscribe from this list
            </Link>
            <Text style={footerText}>
              © 2026 Company Name. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

Newsletter.PreviewProps = {
  articles: [
    {
      title: 'The Future of Web Development in 2026',
      excerpt: 'Exploring the latest trends and technologies shaping modern web development.',
      image: 'https://via.placeholder.com/600x300',
      url: 'https://example.com/article-1',
      author: 'Jane Doe',
      date: 'Jan 15, 2026'
    },
    {
      title: 'React Server Components Explained',
      excerpt: 'A deep dive into React Server Components and their benefits.',
      image: 'https://via.placeholder.com/280x140',
      url: 'https://example.com/article-2',
      author: 'John Smith',
      date: 'Jan 14, 2026'
    },
    {
      title: 'Building Accessible Web Apps',
      excerpt: 'Best practices for creating inclusive digital experiences.',
      image: 'https://via.placeholder.com/280x140',
      url: 'https://example.com/article-3',
      author: 'Sarah Johnson',
      date: 'Jan 13, 2026'
    }
  ],
  unsubscribeUrl: 'https://example.com/unsubscribe'
} as NewsletterProps;

const main = { backgroundColor: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' };
const container = { margin: '0 auto', maxWidth: '600px' };
const header = { padding: '40px 20px 20px 20px', textAlign: 'center' as const };
const h1 = { fontSize: '32px', fontWeight: 'bold', color: '#1a1a1a', margin: '0 20px 16px 20px', textAlign: 'center' as const };
const h2 = { fontSize: '24px', fontWeight: 'bold', color: '#1a1a1a', margin: '32px 20px 16px 20px' };
const h3 = { fontSize: '18px', fontWeight: 'bold', color: '#1a1a1a', margin: '12px 0 8px 0' };
const intro = { fontSize: '16px', lineHeight: '24px', color: '#666', margin: '0 20px 24px 20px', textAlign: 'center' as const };
const hr = { borderColor: '#e6ebf1', margin: '32px 20px' };
const featuredSection = { padding: '0 20px' };
const featuredImage = { width: '100%', borderRadius: '8px', marginBottom: '16px' };
const excerpt = { fontSize: '16px', lineHeight: '24px', color: '#666', margin: '16px 0' };
const meta = { fontSize: '14px', color: '#999', margin: '8px 0 16px 0' };
const button = {
  backgroundColor: '#007bff',
  color: '#fff',
  padding: '12px 24px',
  borderRadius: '4px',
  textDecoration: 'none',
  display: 'inline-block',
  fontWeight: 'bold'
};
const articleRow = { padding: '0 20px', marginBottom: '24px' };
const articleColumn = { width: '48%', verticalAlign: 'top' as const, padding: '0 1%' };
const articleImage = { width: '100%', borderRadius: '4px', marginBottom: '12px' };
const articleExcerpt = { fontSize: '14px', lineHeight: '20px', color: '#666', margin: '8px 0' };
const link = { fontSize: '14px', color: '#007bff', textDecoration: 'none', fontWeight: '600' };
const footer = { backgroundColor: '#f8f9fa', padding: '32px 20px', marginTop: '32px', textAlign: 'center' as const };
const footerText = { fontSize: '14px', color: '#666', margin: '8px 0' };
const unsubscribeLink = { fontSize: '14px', color: '#007bff', textDecoration: 'underline', margin: '8px 0', display: 'block' };
```

## Team Invitation Email

```tsx
import { Html, Head, Preview, Body, Container, Heading, Text, Button, Hr } from '@react-email/components';

interface TeamInvitationProps {
  inviterName: string;
  inviterEmail: string;
  teamName: string;
  role: string;
  inviteUrl: string;
  expiryDays: number;
}

export default function TeamInvitation({
  inviterName,
  inviterEmail,
  teamName,
  role,
  inviteUrl,
  expiryDays
}: TeamInvitationProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>You've been invited to join {teamName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>You're Invited!</Heading>
          
          <Text style={text}>
            <strong>{inviterName}</strong> ({inviterEmail}) has invited you to join the{' '}
            <strong>{teamName}</strong> team.
          </Text>

          <Section style={infoBox}>
            <Text style={infoLabel}>Role</Text>
            <Text style={infoValue}>{role}</Text>
          </Section>

          <Text style={text}>
            Click the button below to accept the invitation and get started.
          </Text>

          <Button href={inviteUrl} style={button}>
            Accept Invitation
          </Button>

          <Hr style={hr} />

          <Text style={footer}>
            This invitation will expire in {expiryDays} day{expiryDays > 1 ? 's' : ''}.
          </Text>
          <Text style={footer}>
            If you weren't expecting this invitation, you can safely ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

TeamInvitation.PreviewProps = {
  inviterName: 'John Doe',
  inviterEmail: 'john@example.com',
  teamName: 'Acme Corp Engineering',
  role: 'Developer',
  inviteUrl: 'https://example.com/invite/abc123',
  expiryDays: 7
} as TeamInvitationProps;

const main = { backgroundColor: '#f6f9fc', fontFamily: 'Arial, sans-serif' };
const container = { margin: '0 auto', padding: '40px 20px', maxWidth: '560px', backgroundColor: '#ffffff' };
const h1 = { fontSize: '28px', fontWeight: 'bold', color: '#333', textAlign: 'center' as const, marginBottom: '24px' };
const text = { fontSize: '16px', lineHeight: '26px', color: '#333', margin: '16px 0' };
const infoBox = { 
  backgroundColor: '#f8f9fa', 
  padding: '20px', 
  borderRadius: '4px', 
  border: '1px solid #e6ebf1',
  margin: '24px 0'
};
const infoLabel = { 
  fontSize: '12px', 
  color: '#666', 
  textTransform: 'uppercase' as const,
  fontWeight: 'bold',
  marginBottom: '8px'
};
const infoValue = { fontSize: '18px', color: '#333', fontWeight: 'bold', margin: '0' };
const button = {
  backgroundColor: '#28a745',
  color: '#fff',
  padding: '14px 28px',
  borderRadius: '4px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  fontWeight: 'bold',
  fontSize: '16px',
  margin: '24px 0'
};
const hr = { borderColor: '#e6ebf1', margin: '24px 0' };
const footer = { fontSize: '14px', color: '#8898aa', lineHeight: '20px', margin: '8px 0' };

// Define Section for this example
const Section = ({ children, style }: { children?: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={style}>{children}</div>
);
```

These patterns demonstrate:
- Proper component usage
- TypeScript typing
- Inline styling
- Preview props for testing
- Responsive layouts
- Common email scenarios
