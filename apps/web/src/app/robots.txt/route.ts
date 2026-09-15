import { NextResponse } from 'next/server';

const agents = [
  'GPTBot',
  'ChatGPT-User',
  'PerplexityBot',
  'ClaudeBot',
  'anthropic-ai',
  'Google-Extended',
];

const content = [
  'User-Agent: *',
  'Allow: /',
  'Content-Signal: ai-train=yes, search=yes, ai-input=yes',
  '',
  ...agents.flatMap((agent) => [`User-Agent: ${agent}`, 'Allow: /', '']),
  'Host: https://react.email',
  'Sitemap: https://react.email/sitemap.xml',
  '',
].join('\n');

export const dynamic = 'force-static';

export function GET() {
  return new NextResponse(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
