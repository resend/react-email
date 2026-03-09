# Common Email Patterns

Real-world examples of common email templates using React Email with Tailwind CSS styling.

## Password Reset Email

```tsx
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Heading,
  Text,
  Button,
  Hr,
  Tailwind,
  pixelBasedPreset
} from '@react-email/components';

interface PasswordResetProps {
  resetUrl: string;
  email: string;
  expiryHours?: number;
}

export default function PasswordReset({ resetUrl, email, expiryHours = 1 }: PasswordResetProps) {
  return (
    <Html lang="en">
      <Tailwind config={{ presets: [pixelBasedPreset] }}>
        <Head />
        <Preview>Reset your password - Action required</Preview>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto py-40 px-20 max-w-600 bg-white">
            <Heading className="text-24 font-bold text-gray-800 mb-20">
              Reset Your Password
            </Heading>
            <Text className="text-16 leading-28 text-gray-800 my-16">
              A password reset was requested for your account: <strong>{email}</strong>
            </Text>
            <Text className="text-16 leading-28 text-gray-800 my-16">
              Click the button below to reset your password. This link expires in {expiryHours} hour{expiryHours > 1 ? 's' : ''}.
            </Text>
            <Button
              href={resetUrl}
              className="bg-red-600 text-white px-28 py-14 rounded block text-center font-bold my-24 no-underline box-border"
            >
              Reset Password
            </Button>
            <Hr className="border-gray-200 my-24" />
            <Text className="text-14 text-gray-500 leading-20 my-8">
              If you didn't request this, please ignore this email. Your password will remain unchanged.
            </Text>
            <Text className="text-14 text-gray-500 leading-20 my-8">
              For security, this link will only work once.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

 PasswordReset.PreviewProps = {
  resetUrl: 'https://example.com/reset/abc123',
  email: 'user@example.com',
  expiryHours: 1
} as PasswordResetProps;
```

## Order Confirmation with Product List

```tsx
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Row,
  Column,
  Heading,
  Text,
  Img,
  Hr,
  Tailwind,
  pixelBasedPreset
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
      <Tailwind config={{ presets: [pixelBasedPreset] }}>
        <Head />
        <Preview>Order #{orderNumber} confirmed - Thank you for your purchase!</Preview>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto py-40 px-20 max-w-600">
            <Heading className="text-30 font-bold text-gray-800 mb-8">
              Order Confirmed
            </Heading>
            <Text className="text-16 text-gray-500 mb-24">Thank you for your order!</Text>

            <Section className="bg-gray-50 p-16 rounded mb-24">
              <Row>
                <Column>
                  <Text className="text-12 text-gray-500 uppercase mb-4">Order Number</Text>
                  <Text className="text-16 font-bold text-gray-800 m-0">#{orderNumber}</Text>
                </Column>
                <Column>
                  <Text className="text-12 text-gray-500 uppercase mb-4">Order Date</Text>
                  <Text className="text-16 font-bold text-gray-800 m-0">{orderDate.toLocaleDateString()}</Text>
                </Column>
              </Row>
            </Section>

            <Hr className="border-gray-200 my-24" />

            <Heading as="h2" className="text-20 font-bold text-gray-800 my-16">
              Order Items
            </Heading>

            {items.map((item, index) => (
              <Section key={index} className="mb-16">
                <Row>
                  <Column className="w-80 align-top">
                    <Img
                      src={item.image}
                      alt={item.name}
                      width="80"
                      height="80"
                      className="rounded border border-gray-200"
                    />
                  </Column>
                  <Column className="align-top pl-16">
                    <Text className="text-16 font-bold text-gray-800 m-0 mb-4">{item.name}</Text>
                    {item.sku && <Text className="text-14 text-gray-400 m-0 mb-8">SKU: {item.sku}</Text>}
                    <Text className="text-14 text-gray-500 m-0">
                      Quantity: {item.quantity} × ${item.price.toFixed(2)}
                    </Text>
                  </Column>
                  <Column className="w-96 text-right align-top">
                    <Text className="text-16 font-bold text-gray-800 m-0">
                      ${(item.quantity * item.price).toFixed(2)}
                    </Text>
                  </Column>
                </Row>
              </Section>
            ))}

            <Hr className="border-gray-200 my-24" />

            <Section className="mt-24">
              <Row>
                <Column><Text className="text-14 text-gray-500 my-8">Subtotal</Text></Column>
                <Column className="text-right">
                  <Text className="text-14 text-gray-800 my-8">${subtotal.toFixed(2)}</Text>
                </Column>
              </Row>
              <Row>
                <Column><Text className="text-14 text-gray-500 my-8">Shipping</Text></Column>
                <Column className="text-right">
                  <Text className="text-14 text-gray-800 my-8">${shipping.toFixed(2)}</Text>
                </Column>
              </Row>
              <Row>
                <Column><Text className="text-14 text-gray-500 my-8">Tax</Text></Column>
                <Column className="text-right">
                  <Text className="text-14 text-gray-800 my-8">${tax.toFixed(2)}</Text>
                </Column>
              </Row>
              <Hr className="border-gray-200 my-12" />
              <Row>
                <Column><Text className="text-18 font-bold text-gray-800 my-8">Total</Text></Column>
                <Column className="text-right">
                  <Text className="text-18 font-bold text-gray-800 my-8">${total.toFixed(2)}</Text>
                </Column>
              </Row>
            </Section>

            <Hr className="border-gray-200 my-24" />

            <Heading as="h2" className="text-20 font-bold text-gray-800 my-16">
              Shipping Address
            </Heading>
            <Section className="bg-gray-50 p-16 rounded">
              <Text className="text-14 text-gray-800 my-4">{shippingAddress.name}</Text>
              <Text className="text-14 text-gray-800 my-4">{shippingAddress.street}</Text>
              <Text className="text-14 text-gray-800 my-4">
                {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}
              </Text>
              <Text className="text-14 text-gray-800 my-4">{shippingAddress.country}</Text>
            </Section>

            <Text className="text-14 text-gray-500 mt-32">
              Questions about your order? Reply to this email and we'll help you out.
            </Text>
          </Container>
        </Body>
      </Tailwind>
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
```

## Notification Email with Code Block

```tsx
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Heading,
  Text,
  CodeBlock,
  dracula,
  Hr,
  Link,
  Tailwind,
  pixelBasedPreset
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
    info: 'bg-sky-500',
    warning: 'bg-amber-500',
    error: 'bg-red-500',
    success: 'bg-green-500'
  };

  const severityBtnColors = {
    info: 'bg-sky-500',
    warning: 'bg-amber-500',
    error: 'bg-red-500',
    success: 'bg-green-500'
  };

  return (
    <Html lang="en">
      <Tailwind config={{ presets: [pixelBasedPreset] }}>
        <Head />
        <Preview>{title} - {severity}</Preview>
        <Body className="bg-gray-100 font-mono">
          <Container className="mx-auto max-w-600 bg-white border border-gray-200 rounded overflow-hidden">
            <Section className={`h-4 w-full ${severityColors[severity]}`} />

            <Heading className="text-24 font-bold text-gray-800 mx-24 mt-24 mb-16">
              {title}
            </Heading>

            <Text className={`inline-block px-12 py-4 text-12 font-bold text-white rounded-full mx-24 mb-16 ${severityBtnColors[severity]}`}>
              {severity.toUpperCase()}
            </Text>

            <Text className="text-16 leading-24 text-gray-800 mx-24 mb-16">
              {message}
            </Text>

            <Text className="text-14 text-gray-500 mx-24 mb-24">
              {new Date(timestamp).toLocaleString('en-US', {
                dateStyle: 'long',
                timeStyle: 'short'
              })}
            </Text>

            {logData && (
              <>
                <Hr className="border-gray-200 my-24" />
                <Heading as="h2" className="text-18 font-bold text-gray-800 mx-24 my-16">
                  Log Details
                </Heading>
                <Section className="mx-24">
                  <div className="overflow-auto">
                    <CodeBlock
                      code={logData}
                      language="json"
                      theme={dracula}
                      lineNumbers
                    />
                  </div>
                </Section>
              </>
            )}

            {actionUrl && (
              <>
                <Hr className="border-gray-200 my-24" />
                <Link
                  href={actionUrl}
                  className={`inline-block px-24 py-12 text-16 font-bold text-white rounded no-underline mx-24 mb-24 ${severityBtnColors[severity]}`}
                >
                  {actionLabel}
                </Link>
              </>
            )}

            <Hr className="border-gray-200 my-24" />
            <Text className="text-12 text-gray-500 mx-24 mb-24">
              This is an automated notification. Please do not reply to this email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
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
```

## Multi-Column Newsletter

```tsx
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Row,
  Column,
  Heading,
  Text,
  Img,
  Button,
  Hr,
  Link,
  Tailwind,
  pixelBasedPreset
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
      <Tailwind config={{ presets: [pixelBasedPreset] }}>
        <Head />
        <Preview>Your weekly roundup of the latest articles</Preview>
        <Body className="bg-white font-sans">
          <Container className="mx-auto max-w-600">
            {/* Header */}
            <Section className="pt-40 px-20 pb-20 text-center">
              <Img
                src="https://via.placeholder.com/150x50?text=Logo"
                alt="Company Logo"
                width="150"
                height="50"
              />
            </Section>

            <Heading className="text-30 font-bold text-gray-900 mx-20 mb-16 text-center">
              This Week's Highlights
            </Heading>
            <Text className="text-16 leading-24 text-gray-500 mx-20 mb-24 text-center">
              Here are the top articles from this week. Enjoy your reading!
            </Text>

            <Hr className="border-gray-200 mx-20 my-32" />

            {/* Featured Article */}
            {articles[0] && (
              <Section className="px-20">
                <Img
                  src={articles[0].image}
                  alt={articles[0].title}
                  width="600"
                  className="w-full rounded-lg mb-16"
                />
                <Heading as="h2" className="text-24 font-bold text-gray-900 my-16">
                  {articles[0].title}
                </Heading>
                <Text className="text-16 leading-24 text-gray-500 my-16">
                  {articles[0].excerpt}
                </Text>
                <Text className="text-14 text-gray-400 my-8">
                  By {articles[0].author} • {articles[0].date}
                </Text>
                <Button
                  href={articles[0].url}
                  className="bg-blue-600 text-white px-24 py-12 rounded font-bold inline-block no-underline box-border"
                >
                  Read More
                </Button>
              </Section>
            )}

            <Hr className="border-gray-200 mx-20 my-32" />

            {/* Two-Column Articles */}
            {articles.slice(1, 5).length > 0 && (
              <>
                <Heading as="h2" className="text-24 font-bold text-gray-900 mx-20 my-16">
                  More From This Week
                </Heading>
                {Array.from({ length: Math.ceil(articles.slice(1, 5).length / 2) }).map((_, rowIndex) => {
                  const leftArticle = articles[1 + rowIndex * 2];
                  const rightArticle = articles[2 + rowIndex * 2];

                  return (
                    <Section key={rowIndex} className="px-20 mb-24">
                      <Row>
                        {leftArticle && (
                          <Column className="w-1/2 align-top px-4">
                            <Img
                              src={leftArticle.image}
                              alt={leftArticle.title}
                              width="280"
                              className="w-full rounded mb-12"
                            />
                            <Heading as="h3" className="text-18 font-bold text-gray-900 my-12">
                              {leftArticle.title}
                            </Heading>
                            <Text className="text-14 leading-20 text-gray-500 my-8">
                              {leftArticle.excerpt}
                            </Text>
                            <Link href={leftArticle.url} className="text-14 text-blue-600 no-underline font-semibold">
                              Read article →
                            </Link>
                          </Column>
                        )}

                        {rightArticle && (
                          <Column className="w-1/2 align-top px-4">
                            <Img
                              src={rightArticle.image}
                              alt={rightArticle.title}
                              width="280"
                              className="w-full rounded mb-12"
                            />
                            <Heading as="h3" className="text-18 font-bold text-gray-900 my-12">
                              {rightArticle.title}
                            </Heading>
                            <Text className="text-14 leading-20 text-gray-500 my-8">
                              {rightArticle.excerpt}
                            </Text>
                            <Link href={rightArticle.url} className="text-14 text-blue-600 no-underline font-semibold">
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

            <Hr className="border-gray-200 mx-20 my-32" />

            {/* Footer */}
            <Section className="bg-gray-50 p-32 mt-32 text-center">
              <Text className="text-14 text-gray-500 my-8">
                You're receiving this because you subscribed to our newsletter.
              </Text>
              <Link href={unsubscribeUrl} className="text-14 text-blue-600 underline block my-8">
                Unsubscribe from this list
              </Link>
              <Text className="text-14 text-gray-500 my-8">
                © 2026 Company Name. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
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
```

## Team Invitation Email

```tsx
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Button,
  Hr,
  Tailwind,
  pixelBasedPreset
} from '@react-email/components';

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
      <Tailwind config={{ presets: [pixelBasedPreset] }}>
        <Head />
        <Preview>You've been invited to join {teamName}</Preview>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto py-40 px-20 max-w-600 bg-white">
            <Heading className="text-30 font-bold text-gray-800 text-center mb-24">
              You're Invited!
            </Heading>

            <Text className="text-16 leading-28 text-gray-800 my-16">
              <strong>{inviterName}</strong> ({inviterEmail}) has invited you to join the{' '}
              <strong>{teamName}</strong> team.
            </Text>

            <Section className="bg-gray-50 p-20 rounded border border-gray-200 my-24">
              <Text className="text-12 text-gray-500 uppercase font-bold mb-8">Role</Text>
              <Text className="text-18 font-bold text-gray-800 m-0">{role}</Text>
            </Section>

            <Text className="text-16 leading-28 text-gray-800 my-16">
              Click the button below to accept the invitation and get started.
            </Text>

            <Button
              href={inviteUrl}
              className="bg-green-600 text-white px-28 py-14 rounded block text-center font-bold text-16 my-24 no-underline box-border"
            >
              Accept Invitation
            </Button>

            <Hr className="border-gray-200 my-24" />

            <Text className="text-14 text-gray-500 leading-20 my-8">
              This invitation will expire in {expiryDays} day{expiryDays > 1 ? 's' : ''}.
            </Text>
            <Text className="text-14 text-gray-500 leading-20 my-8">
              If you weren't expecting this invitation, you can safely ignore this email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
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
```

These patterns demonstrate:
- Tailwind CSS pixel-based utility classes with `pixelBasedPreset`
- Proper component usage (`pixelBasedPreset`, `box-border` on Button)
- TypeScript typing
- Preview props for testing
- Responsive layouts using Row/Column
- Common email scenarios
