import type { MetadataRoute } from 'next';
import { componentsStructure } from '../../components/structure';
import { slugify } from '../utils/slugify';

const editorExampleSlugs = [
  'basic-editor',
  'bubble-menu',
  'slash-commands',
  'custom-bubble-menu',
  'link-editing',
  'column-layouts',
  'buttons',
  'image-upload',
  'email-theming',
  'email-export',
  'custom-extensions',
  'inspector-defaults',
  'inspector-composed',
  'inspector-custom',
  'full-email-builder',
  'standalone-editor',
  'standalone-editor-full',
  'standalone-editor-inspector',
];

const Sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const lastModified = new Date().toISOString().split('T')[0];

  const staticRoutes = ['', '/components', '/templates'].map((route) => ({
    url: `https://react.email${route}`,
    lastModified,
  }));

  const componentRoutes = componentsStructure.map((category) => ({
    url: `https://react.email/components/${slugify(category.name)}`,
    lastModified,
  }));

  const editorRoutes = [
    { url: 'https://react.email/editor/examples', lastModified },
    ...editorExampleSlugs.map((slug) => ({
      url: `https://react.email/editor/examples/${slug}`,
      lastModified,
    })),
  ];

  return [...staticRoutes, ...componentRoutes, ...editorRoutes];
};

export default Sitemap;
