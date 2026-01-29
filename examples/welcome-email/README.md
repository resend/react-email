# Welcome Email Template

A production-ready welcome email template built with React Email. Includes a professional design with logo support, feature highlights, and call-to-action button.

## Features

- Professional, responsive email design
- Logo/branding image support
- Personalized user greeting
- Feature highlights section
- Call-to-action button
- Support links and footer
- Mobile-friendly styling
- Email client compatibility

## Quick Start

### 1. Installation

```bash
npm install
# or
pnpm install
```

### 2. Basic Usage

```tsx
import WelcomeEmail from './src/email';
import { render } from '@react-email/render';

const emailHtml = render(
  <WelcomeEmail
    userName="John Doe"
    companyName="Acme Corp"
    dashboardUrl="https://app.acmecorp.com"
    logoUrl="https://assets.acmecorp.com/logo.png"
  />
);
```

### 3. Send with Resend

```tsx
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'onboarding@acmecorp.com',
  to: 'user@example.com',
  subject: 'Welcome to Acme Corp!',
  html: emailHtml,
});
```

## Static Files Setup

### For Your Logo

The component expects a `logoUrl` prop that should be a **complete absolute URL**:

```tsx
// ✓ Correct - Full URL
logoUrl="https://assets.acmecorp.com/logo.png"

// ✗ Wrong - Relative path won't work in emails
logoUrl="/assets/logo.png"

// ✗ Wrong - Local file reference
logoUrl="./assets/logo.png"
```

### How to Host Your Logo

**Option 1: Use a CDN**
```bash
# Upload logo.png to your CDN
# Get the public URL
logoUrl="https://cdn.example.com/assets/logo.png"
```

**Option 2: AWS S3 + CloudFront**
```bash
# Upload to S3, use CloudFront distribution URL
logoUrl="https://d123.cloudfront.net/assets/logo.png"
```

**Option 3: Host on your server**
```bash
# Place in public directory and serve
logoUrl="https://yourdomain.com/assets/logo.png"
```

**Option 4: Local Development (Base64)**
```tsx
import fs from 'fs';
const logoBase64 = fs.readFileSync('assets/logo.png', 'base64');
const logoUrl = `data:image/png;base64,${logoBase64}`;
```

See [SETUP.md](./SETUP.md) for detailed configuration instructions.

## Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `userName` | string | "there" | Name of the recipient |
| `companyName` | string | "Our Company" | Your company/product name |
| `dashboardUrl` | string | "https://example.com/dashboard" | App/dashboard URL |
| `logoUrl` | string | "https://your-domain.com/logo.png" | Full URL to logo image |

## Customization

Edit `src/email.tsx` to:
- Change colors (look for style objects at the bottom)
- Add or remove sections
- Update feature list items
- Change button text and styling
- Modify fonts and spacing

### Color Scheme
The template uses:
- Primary blue: `#3b82f6`
- Dark gray text: `#1f2937`, `#4b5563`
- Light background: `#f9fafb`
- Border color: `#e5e7eb`

## Project Structure

```
welcome-email/
├── src/
│   ├── email.tsx       # Email component (main template)
│   └── index.tsx       # Usage example
├── SETUP.md            # Detailed setup guide
├── README.md           # This file
└── package.json        # Dependencies
```

## Testing

### Local Development
```bash
npm run dev
```

### Preview in Browser
```bash
npx react-email start
```

Navigate to `http://localhost:3000` and select the Welcome Email template.

### Send Test Email
Update `src/index.tsx` with your test credentials and run:
```bash
npm run dev
```

## Examples Included

See `src/index.tsx` for:
- Basic rendering example
- Resend integration example (commented)
- Environment variable usage

## Email Client Support

Tested and compatible with:
- Gmail
- Outlook
- Apple Mail
- Yahoo Mail
- Thunderbird
- Mobile clients (iOS, Android)

## Best Practices

1. **Always use absolute URLs** for images in emails
2. **Test with multiple email clients** - not all support the same CSS
3. **Use inline styles** - most email clients strip `<style>` tags
4. **Include alt text** for all images for accessibility
5. **Keep file sizes small** - large images may be blocked
6. **Use HTTPS** for all image URLs

## Troubleshooting

### Images not showing
- Verify the URL is publicly accessible
- Test the URL in your browser
- Ensure it's an absolute HTTPS URL
- Check email client's image display settings

### Styling looks different in email
- Email clients have limited CSS support
- Test with the target email client
- Use inline styles (already done here)
- Avoid JavaScript and complex CSS

### Layout issues on mobile
- The template is responsive and mobile-friendly
- Test on actual mobile devices
- Some email clients have email-specific layout limitations

## Resources

- [React Email Docs](https://react.email)
- [Email Design Best Practices](https://www.litmus.com/)
- [MJML Framework](https://mjml.io/) - Alternative email framework
- [Can I Email](https://www.caninemail.com/) - CSS support reference

## License

MIT
