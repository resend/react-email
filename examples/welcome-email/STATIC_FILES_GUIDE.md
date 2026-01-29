# Static Files Setup Guide for Welcome Email

This comprehensive guide explains how to properly set up and serve static files (like your logo) when using the Welcome Email template.

## The Challenge

Email clients are different from web browsers. When sending emails, you **cannot use relative paths or local file references**. The email recipient's email client won't have access to your server's file system.

## Solution: Use Absolute URLs

All static files must be served via complete absolute URLs (HTTPS).

```tsx
// ✓ CORRECT - This works in emails
<Img src="https://assets.acmecorp.com/logo.png" />

// ✗ WRONG - These don't work in emails
<Img src="/assets/logo.png" />          // Relative path
<Img src="./assets/logo.png" />         // Relative path
<Img src="file:///Users/.../logo.png" /> // Local file
```

## Step-by-Step Setup

### Step 1: Prepare Your Assets

Create an assets directory in your project:

```bash
mkdir -p assets
cp your-logo.png assets/logo.png
```

File requirements:
- **Format**: PNG, JPG, GIF, WebP
- **Size**: Keep under 1MB (500KB recommended for better email delivery)
- **Dimensions**: 200-400px width (logos scale up/down)
- **Quality**: Use optimized images (compress with TinyPNG, etc.)

### Step 2: Choose a Hosting Method

#### Option A: CDN (Recommended)

Best for production - global distribution, fast loading, reliable.

**Cloudflare Pages/Workers**
```bash
# 1. Create Cloudflare account
# 2. Upload assets directory
# 3. Get public URL: https://assets.example.com/logo.png

logoUrl="https://assets.example.com/logo.png"
```

**AWS CloudFront + S3**
```bash
# 1. Create S3 bucket: my-email-assets
# 2. Upload logo.png to s3://my-email-assets/logo.png
# 3. Create CloudFront distribution pointing to S3
# 4. Distribution URL: https://d123abc.cloudfront.net

logoUrl="https://d123abc.cloudfront.net/logo.png"
```

**Vercel/Netlify (if hosting there)**
```bash
# Place assets in public/ directory
# They're automatically served at your domain

logoUrl="https://yourdomain.com/logo.png"
```

#### Option B: Your Own Server

Host assets on your existing web server.

```bash
# Place in web root
public/assets/logo.png

# Access via your domain
logoUrl="https://yourdomain.com/assets/logo.png"

# Important: Configure CORS if needed
# Set appropriate cache headers in web server config
```

#### Option C: Base64 Data URLs (Local Development Only)

Good for testing locally, not recommended for production.

```tsx
import fs from 'fs';
import path from 'path';

function getLogoUrl() {
  if (process.env.NODE_ENV === 'production') {
    // Use CDN URL in production
    return process.env.LOGO_URL;
  }

  // Local development: convert to base64
  const logoPath = path.join(process.cwd(), 'assets', 'logo.png');
  const logoBuffer = fs.readFileSync(logoPath);
  const logoBase64 = logoBuffer.toString('base64');
  return `data:image/png;base64,${logoBase64}`;
}

const emailHtml = render(
  <WelcomeEmail
    userName="John"
    logoUrl={getLogoUrl()}
  />
);
```

### Step 3: Use Environment Variables

Store URLs in environment variables for flexibility.

**.env.local**
```
LOGO_URL=https://assets.acmecorp.com/logo.png
COMPANY_LOGO=https://assets.acmecorp.com/company-logo.png
```

**Code Usage**
```tsx
const emailHtml = render(
  <WelcomeEmail
    userName={userName}
    logoUrl={process.env.LOGO_URL}
    companyName="Acme Corp"
  />
);
```

### Step 4: Verify Setup

Before sending emails, verify the URL works:

```bash
# Test the URL in your browser
curl -I https://assets.acmecorp.com/logo.png

# Should return 200 OK
# Content-Type: image/png
```

## Implementation Example

### Full Working Example

```tsx
// src/send-welcome-email.ts
import { Resend } from 'resend';
import { render } from '@react-email/render';
import WelcomeEmail from './email';

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendWelcomeEmail(
  userEmail: string,
  userName: string
) {
  // Build absolute URLs
  const logoUrl = process.env.LOGO_URL || 'https://assets.example.com/logo.png';
  const dashboardUrl = process.env.DASHBOARD_URL || 'https://app.example.com';

  // Render email with absolute URLs
  const emailHtml = render(
    <WelcomeEmail
      userName={userName}
      companyName="Acme Corp"
      dashboardUrl={dashboardUrl}
      logoUrl={logoUrl}  // Important: full absolute URL
    />
  );

  // Send email
  const response = await resend.emails.send({
    from: 'onboarding@acmecorp.com',
    to: userEmail,
    subject: 'Welcome to Acme Corp!',
    html: emailHtml,
  });

  return response;
}

export default sendWelcomeEmail;
```

**Environment Setup (.env.production)**
```
RESEND_API_KEY=re_abc123...
LOGO_URL=https://assets.acmecorp.com/logo.png
DASHBOARD_URL=https://app.acmecorp.com
```

## Common Hosting Setups

### Setup 1: Next.js with Vercel

```
project/
├── public/
│   └── assets/
│       └── logo.png          # Automatically served
├── src/
│   └── emails/
│       └── welcome.tsx
└── .env.local
```

**Access via:**
```
https://yourdomain.vercel.app/assets/logo.png
```

**Code:**
```tsx
const logoUrl = `${process.env.NEXT_PUBLIC_APP_URL}/assets/logo.png`;
```

### Setup 2: AWS Lambda + S3

```
S3 Bucket: my-email-assets
  └── logo.png

CloudFront Distribution
  └── Origin: S3 bucket
  └── URL: https://d123.cloudfront.net
```

**Code:**
```tsx
const logoUrl = 'https://d123.cloudfront.net/logo.png';
```

### Setup 3: Dedicated Asset Server

```
assets.example.com/
├── nginx server
├── /var/www/assets/
│   └── logo.png
└── Listen on port 443 (HTTPS)
```

**Code:**
```tsx
const logoUrl = 'https://assets.example.com/logo.png';
```

## Troubleshooting

### Problem: Images not showing in Gmail

**Causes:**
- URL is not publicly accessible
- URL is not HTTPS
- Image host blocks email clients
- File doesn't exist

**Solution:**
```bash
# Test the URL
curl -I https://assets.acmecorp.com/logo.png

# Should return:
# HTTP/1.1 200 OK
# Content-Type: image/png
# Content-Length: 12345
```

### Problem: Images not showing in Outlook

**Causes:**
- Outlook is very strict about image sources
- May block images by default

**Solution:**
- Use a trusted domain (your own domain preferred)
- Add proper cache headers
- Verify CORS headers if cross-origin

### Problem: Slow image loading in emails

**Causes:**
- Image file too large
- Slow server response
- CDN not optimized

**Solution:**
```bash
# Optimize image size
# Use tools like TinyPNG, ImageOptim
# Target: <100KB per image

# Use a CDN for faster delivery
# Cloudflare, AWS CloudFront, etc.

# Add cache headers to your server
Cache-Control: public, max-age=31536000
```

### Problem: "Cannot connect to host" errors

**Causes:**
- Wrong URL format
- Domain not accessible
- Firewall blocking

**Solution:**
```bash
# Verify domain works
ping assets.acmecorp.com

# Test HTTPS
openssl s_client -connect assets.acmecorp.com:443

# Verify in browser
# Visit https://assets.acmecorp.com/logo.png
```

## Security Considerations

### CORS Headers

If images are served from a different domain:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, HEAD
```

### HTTPS Only

Always use HTTPS URLs:
```tsx
// ✓ Good
logoUrl="https://assets.acmecorp.com/logo.png"

// ✗ Bad - HTTP will cause mixed content warnings
logoUrl="http://assets.acmecorp.com/logo.png"
```

### Rate Limiting

Protect your asset servers from abuse:

```nginx
# Nginx example
limit_req_zone $binary_remote_addr zone=assets:10m rate=50r/s;

location /assets/ {
    limit_req zone=assets burst=100 nodelay;
}
```

## Performance Tips

### Image Optimization

```bash
# Compress PNG
pngquant --quality 70-90 logo.png -o logo-optimized.png

# Compress JPEG
convert logo.jpg -quality 80 logo-optimized.jpg

# Create WebP (modern clients)
cwebp -q 80 logo.png -o logo.webp
```

### Caching Strategy

Set appropriate cache headers in your server:

```nginx
# Nginx
location /assets/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### CDN Configuration

**Cloudflare Example:**
1. Go to Caching Rules
2. Set cache duration to 1 month
3. Enable "Cache on Everything"
4. Set browser cache to 1 year

## Testing

### Preview Email in Browser

```bash
# Start React Email preview server
npx react-email start

# Visit http://localhost:3000
# Select welcome-email template
```

### Send Test Email

```tsx
// test-email.ts
import sendWelcomeEmail from './send-welcome-email';

async function test() {
  const result = await sendWelcomeEmail(
    'your-test-email@gmail.com',
    'Test User'
  );
  console.log('Email sent:', result.id);
}

test().catch(console.error);
```

### Validate Email HTML

Tools to validate generated HTML:
- [Email on Acid](https://www.emailonacid.com/)
- [Litmus](https://www.litmus.com/)
- [Mailtrap](https://mailtrap.io/)

## Checklist

Before sending to production:

- [ ] Logo file exists and is optimized
- [ ] Logo URL is HTTPS
- [ ] Logo URL is publicly accessible
- [ ] Test URL works in browser
- [ ] Image dimensions are specified (width/height)
- [ ] Alt text is provided for logo
- [ ] Environment variables are configured
- [ ] Email renders correctly in major clients
- [ ] Cache headers are set appropriately
- [ ] CORS is configured if needed

## Summary

| Method | Best For | Setup Time | Cost |
|--------|----------|-----------|------|
| CDN (Cloudflare) | Production | 10 min | Free-$200/mo |
| AWS S3 + CloudFront | Large scale | 20 min | $0.085/GB |
| Your own server | Full control | 30 min | Server cost |
| Vercel/Netlify | Next.js apps | 5 min | Free-$20/mo |
| Base64 (dev only) | Testing | 2 min | Free |

For most production use cases, we recommend **Cloudflare Pages** or **Vercel** for simplicity, or **AWS S3 + CloudFront** for larger scale applications.
