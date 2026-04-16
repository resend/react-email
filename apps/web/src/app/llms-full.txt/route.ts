import { NextResponse } from 'next/server';
import { componentsStructure } from '../../../components/structure';

export function GET() {
  const lines: string[] = [
    '# React Email — Full Component Catalog',
    '',
    '> A collection of high-quality, unstyled components for creating beautiful emails using React and TypeScript.',
    '',
    'React Email is an open-source library that lets developers build emails with React components instead of raw HTML tables. Components are copy-paste ready and work with any email provider.',
    '',
    '## Installation',
    '',
    '```',
    'npx create-email@latest',
    '```',
    '',
    '## Primitives',
    '',
    'Core building blocks available as npm packages:',
    '',
    '- @react-email/body — <Body> wrapper',
    '- @react-email/button — <Button> with link support',
    '- @react-email/column — <Column> for table-based layouts',
    '- @react-email/container — <Container> with max-width centering',
    '- @react-email/font — <Font> for web font loading',
    '- @react-email/head — <Head> with meta tags',
    '- @react-email/heading — <Heading> (h1-h6)',
    '- @react-email/hr — <Hr> horizontal rule',
    '- @react-email/html — <Html> root element',
    '- @react-email/img — <Img> with dimensions',
    '- @react-email/link — <Link> anchor tag',
    '- @react-email/markdown — <Markdown> renderer',
    '- @react-email/preview — <Preview> preheader text',
    '- @react-email/row — <Row> for table rows',
    '- @react-email/section — <Section> table wrapper',
    '- @react-email/tailwind — <Tailwind> CSS utility support',
    '- @react-email/text — <Text> paragraph',
    '',
    '## Component Categories',
    '',
  ];

  for (const category of componentsStructure) {
    lines.push(`### ${category.name}`);
    lines.push('');
    lines.push(category.description);
    lines.push('');
    lines.push(`URL: https://react.email/components/${category.name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-')}`);
    lines.push('');

    for (const component of category.components) {
      lines.push(`- ${component.title}`);
    }

    lines.push('');
  }

  lines.push('## Integrations');
  lines.push('');
  lines.push('Works with any email sending service:');
  lines.push('');
  lines.push('- Resend (https://react.email/docs/integrations/resend)');
  lines.push('- SendGrid (https://react.email/docs/integrations/sendgrid)');
  lines.push('- AWS SES (https://react.email/docs/integrations/aws-ses)');
  lines.push('- Postmark (https://react.email/docs/integrations/postmark)');
  lines.push('- Nodemailer (https://react.email/docs/integrations/nodemailer)');
  lines.push('');
  lines.push('## Links');
  lines.push('');
  lines.push('- Documentation: https://react.email/docs');
  lines.push('- GitHub: https://github.com/resend/react-email');
  lines.push('- npm: https://www.npmjs.com/package/react-email');
  lines.push('- Templates: https://react.email/templates');
  lines.push('- Editor: https://react.email/editor/examples');
  lines.push('');

  return new NextResponse(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
