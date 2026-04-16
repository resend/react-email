import { NextResponse } from 'next/server';

const content = `# React Email

> A collection of high-quality, unstyled components for creating beautiful emails using React and TypeScript.

React Email is an open-source library that lets developers build emails with React components instead of raw HTML tables. It includes unstyled primitives (Button, Container, Head, Html, Img, Link, Section, Text, etc.) and a pattern library of 60+ copy-paste components across 25 categories.

## Key Links

- Documentation: https://react.email/docs
- Components: https://react.email/components
- Templates: https://react.email/templates
- Editor: https://react.email/editor/examples
- GitHub: https://github.com/resend/react-email
- npm: https://www.npmjs.com/package/react-email

## Getting Started

npx create-email@latest

## Integrations

Works with any email provider: Resend, SendGrid, AWS SES, Postmark, Nodemailer, and more.

## Component Categories

Headers, Footers, Container, Section, Grid, Divider, Heading, Text, Link, Buttons, Image, Avatars, Gallery, List, Code Inline, Code Block, Markdown, Articles, Features, Stats, Testimonials, Feedback, Pricing, Ecommerce, Marketing

## Optional

- [Full component catalog](https://react.email/llms-full.txt)
`;

export function GET() {
  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
