import { templateSourceUrl, templatesMarkdown } from './markdown';

const official = {
  name: 'Matte',
  href: 'https://demo.react.email/preview/02-Matte/welcome',
  github:
    'https://github.com/resend/react-email/tree/canary/apps/demo/emails/02-Matte',
  figma: 'https://figma.com/community/file/1',
};

const community = {
  name: 'Slack / Confirm Email',
  author: 'c0dr',
  href: 'https://demo.react.email/preview/Community/magic-links/slack-confirm',
};

describe('templateSourceUrl', () => {
  it('uses the GitHub link when the template has one', () => {
    expect(templateSourceUrl(official)).toBe(official.github);
  });

  it('derives the source file from the preview path otherwise', () => {
    expect(templateSourceUrl(community)).toBe(
      'https://github.com/resend/react-email/blob/canary/apps/demo/emails/Community/magic-links/slack-confirm.tsx',
    );
  });
});

describe('templatesMarkdown', () => {
  it('lists official and community templates with preview and source links', () => {
    const markdown = templatesMarkdown([official], [community]);

    expect(markdown.indexOf('## Official')).toBeLessThan(
      markdown.indexOf('## Community'),
    );
    expect(markdown).toContain(`### Matte\n\nPreview: ${official.href}`);
    expect(markdown).toContain(`Source: ${official.github}`);
    expect(markdown).toContain(`Figma: ${official.figma}`);
    expect(markdown).toContain('### Slack / Confirm Email\n\nAuthor: c0dr');
    expect(markdown).toContain(
      'Source: https://github.com/resend/react-email/blob/canary/apps/demo/emails/Community/magic-links/slack-confirm.tsx',
    );
    expect(markdown).not.toContain('Figma: undefined');
  });
});
