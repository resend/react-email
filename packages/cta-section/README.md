# CTA Section Component

A reusable Call To Action (CTA) section for React Email projects.

## Usage

```tsx
import { CtaSection } from '@react-email/cta-section';

<CtaSection
  title="Join our newsletter!"
  description="Get the latest updates and offers."
  buttonText="Subscribe"
  buttonUrl="https://example.com/newsletter"
/>
```

## Props
- `title`: string — Main heading for the CTA
- `description`: string (optional) — Supporting text
- `buttonText`: string — Text for the CTA button
- `buttonUrl`: string — URL for the CTA button
