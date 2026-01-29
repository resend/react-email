# Welcome Email Setup Guide

This guide explains how to set up and use the Welcome Email template with static files like logos.

## Overview

The `WelcomeEmail` component is a professional welcome email template that includes:
- Logo/branding image at the top
- Personalized greeting
- Feature highlights
- Call-to-action button
- Support information and footer

## Static Files Setup

### 1. Directory Structure

Create an assets directory to store your static files:

```
your-project/
├── public/
│   └── assets/
│       └── logo.png
├── src/
│   └── emails/
│       └── welcome.tsx
└── package.json
```

### 2. Using Static Files in Production

#### Option A: Hosted Static Files (Recommended for Email)

For emails, it's best to use absolute URLs to hosted assets. This ensures the images load correctly in all email clients:

```tsx
import WelcomeEmail from './email';

const emailHtml = render(
  <WelcomeEmail
    userName="John Doe"
    companyName="Acme Corp"
    dashboardUrl="https://app.acmecorp.com/dashboard"
    logoUrl="https://assets.acmecorp.com/logo.png"  // Full URL
  />
);
```

#### Option B: Using Environment Variables

Store your asset URLs in environment variables:

```bash
# .env
REACT_APP_LOGO_URL=https://assets.acmecorp.com/logo.png
REACT_APP_COMPANY_NAME=Acme Corp
REACT_APP_DASHBOARD_URL=https://app.acmecorp.com/dashboard
```

Then use them in your code:

```tsx
const emailHtml = render(
  <WelcomeEmail
    userName="John Doe"
    companyName={process.env.REACT_APP_COMPANY_NAME}
    dashboardUrl={process.env.REACT_APP_DASHBOARD_URL}
    logoUrl={process.env.REACT_APP_LOGO_URL}
  />
);
```

### 3. Hosting Static Assets

#### Option 1: CDN (Cloudflare, AWS CloudFront, etc.)
```
1. Upload logo.png to your CDN
2. Get the public URL: https://cdn.example.com/logo.png
3. Pass the URL to the component
```

#### Option 2: AWS S3 with CloudFront
```
1. Upload files to S3: s3://your-bucket/assets/logo.png
2. Create CloudFront distribution
3. Use CDN URL: https://d123.cloudfront.net/assets/logo.png
```

#### Option 3: Self-hosted on your server
```
1. Place logo.png in public/assets/ directory
2. Configure your web server to serve it
3. Access via: https://yourdomain.com/assets/logo.png
```

### 4. Local Development with Data URLs

For testing locally, you can convert images to base64 data URLs:

```tsx
import fs from 'fs';
import path from 'path';

// Convert image to base64
const logoPath = path.join(process.cwd(), 'assets', 'logo.png');
const logoBase64 = fs.readFileSync(logoPath, 'base64');
const logoDataUrl = `data:image/png;base64,${logoBase64}`;

const emailHtml = render(
  <WelcomeEmail
    userName="John Doe"
    companyName="Acme Corp"
    dashboardUrl="https://app.acmecorp.com/dashboard"
    logoUrl={logoDataUrl}  // Data URL for local testing
  />
);
```

## Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `userName` | string | "there" | Name of the user receiving the email |
| `companyName` | string | "Our Company" | Name of your company/product |
| `dashboardUrl` | string | "https://example.com/dashboard" | URL to the dashboard/app |
| `logoUrl` | string | "https://your-domain.com/logo.png" | Full URL to logo image |

## Usage Examples

### Basic Usage with Resend

```tsx
import { Resend } from 'resend';
import WelcomeEmail from './email';
import { render } from '@react-email/render';

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendWelcomeEmail(userEmail: string, userName: string) {
  const emailHtml = render(
    <WelcomeEmail
      userName={userName}
      companyName="Acme Corp"
      dashboardUrl="https://app.acmecorp.com/dashboard"
      logoUrl="https://assets.acmecorp.com/logo.png"
    />
  );

  await resend.emails.send({
    from: 'onboarding@acmecorp.com',
    to: userEmail,
    subject: 'Welcome to Acme Corp!',
    html: emailHtml,
  });
}
```

### With Node.js/Express

```tsx
import { Resend } from 'resend';
import WelcomeEmail from './email';
import { render } from '@react-email/render';

app.post('/api/send-welcome', async (req, res) => {
  const { email, name } = req.body;

  const emailHtml = render(
    <WelcomeEmail
      userName={name}
      companyName="Acme Corp"
      dashboardUrl="https://app.acmecorp.com/dashboard"
      logoUrl="https://assets.acmecorp.com/logo.png"
    />
  );

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const response = await resend.emails.send({
      from: 'onboarding@acmecorp.com',
      to: email,
      subject: 'Welcome to Acme Corp!',
      html: emailHtml,
    });

    res.json({ success: true, id: response.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### With AWS SES

```tsx
import AWS from 'aws-sdk';
import WelcomeEmail from './email';
import { render } from '@react-email/render';

const ses = new AWS.SES({ region: 'us-east-1' });

async function sendWelcomeEmailSES(userEmail: string, userName: string) {
  const emailHtml = render(
    <WelcomeEmail
      userName={userName}
      companyName="Acme Corp"
      dashboardUrl="https://app.acmecorp.com/dashboard"
      logoUrl="https://assets.acmecorp.com/logo.png"
    />
  );

  const params = {
    Source: 'onboarding@acmecorp.com',
    Destination: {
      ToAddresses: [userEmail],
    },
    Message: {
      Subject: {
        Data: 'Welcome to Acme Corp!',
        Charset: 'UTF-8',
      },
      Body: {
        Html: {
          Data: emailHtml,
          Charset: 'UTF-8',
        },
      },
    },
  };

  return ses.sendEmail(params).promise();
}
```

## Important Notes

1. **Email Client Compatibility**: Not all email clients support the same HTML/CSS features. Test your emails with services like Litmus or Email on Acid.

2. **Image Display**: Always use absolute URLs for images in emails. Relative paths and local file references won't work in most email clients.

3. **Alt Text**: The component includes proper alt text for the logo image for accessibility.

4. **Image Dimensions**: Specify explicit width/height for images to improve rendering consistency.

5. **HTTPS Only**: Always use HTTPS URLs for images to avoid mixed content warnings.

## Testing

Test the email locally:

```bash
cd examples/welcome-email
npm install
node src/index.tsx  # or tsx src/index.tsx
```

You can use the React Email CLI for preview:

```bash
npx react-email start
```

Then navigate to `http://localhost:3000` and select your email template.

## Customization

Edit `/src/email.tsx` to:
- Change colors (see the styling section at the bottom)
- Add more sections or features
- Modify the layout and spacing
- Add additional variables for dynamic content

## Troubleshooting

### Images Not Showing in Email
- Ensure the logoUrl is a complete absolute URL
- Check that the URL is publicly accessible
- Verify the image format is supported (PNG, JPG, GIF)
- Test with a direct URL in your browser

### Email Rendering Issues
- Test with multiple email clients
- Use inline styles (already done in this template)
- Avoid complex CSS (some email clients have limitations)
- Use web-safe fonts or fallbacks

### CORS Issues When Fetching Images
- Images in emails don't load from the email client's domain
- Always use complete absolute URLs
- Ensure your image host allows images to be loaded by email clients
