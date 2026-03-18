export const publicAssetBaseUrl =
  'https://cdn.jsdelivr.net/gh/resend/react-email@canary/apps/web/public';

const getPublicAssetUrl = (path: `/${string}`) => `${publicAssetBaseUrl}${path}`;

export const homepageOgImage = {
  alt: 'React Email',
  height: 630,
  url: getPublicAssetUrl('/meta/cover.png'),
  width: 1200,
} as const;

export const patternsOgImage = {
  alt: 'React Email components',
  height: 800,
  url: getPublicAssetUrl('/static/covers/patterns.png'),
  width: 1600,
} as const;
