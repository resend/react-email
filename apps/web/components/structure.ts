import path from 'node:path';

export const pathToComponents = path.resolve(process.cwd(), './components');

export interface Category {
  name: string;
  description: string;
  components: Component[];
}

export interface Component {
  slug: string;
  title: string;
}

export const getComponentPathFromSlug = (slug: string) => {
  return path.resolve(pathToComponents, slug);
};

export const componentsStructure: Category[] = [
  {
    name: 'Gallery',
    description:
      'Gallery components for displaying images in grids and columns.',
    components: [
      { slug: 'four-images-in-a-grid', title: 'Four images in a grid' },
      { slug: 'images-on-horizontal-grid', title: 'Images on horizontal grid' },
      { slug: 'images-on-vertical-grid', title: 'Images on vertical grid' },
      { slug: 'three-columns-with-images', title: 'Three columns with images' },
    ],
  },
  {
    name: 'Ecommerce',
    description:
      'Components designed for eCommerce layouts, including product displays and card grids.',
    components: [
      { slug: 'one-product', title: 'One product' },
      {
        slug: 'one-product-with-image-on-the-left',
        title: 'One product with image on the left',
      },
      {
        slug: 'title-three-cards-in-a-row',
        title: 'Title + three cards in a row',
      },
      { slug: 'title-four-cards', title: 'Title + four cards' },
      { slug: 'checkout', title: 'Checkout' },
    ],
  },
  {
    name: 'Articles',
    description:
      'Components for creating various types of articles, including layouts with images and cards.',
    components: [
      { slug: 'article-with-image', title: 'Article with image' },
      {
        slug: 'article-with-image-as-background',
        title: 'Article with image as background',
      },
      {
        slug: 'article-with-image-on-right',
        title: 'Article with image on right',
      },
      { slug: 'article-with-two-cards', title: 'Article with two cards' },
      {
        slug: 'article-with-single-author',
        title: 'Article with single author',
      },
      {
        slug: 'article-with-multiple-authors',
        title: 'Article with multiple authors',
      },
    ],
  },
  {
    name: 'Buttons',
    description:
      'A collection of button components to use in various parts of your application.',
    components: [
      { slug: 'single-button', title: 'Single button' },
      { slug: 'two-buttons', title: 'Two buttons' },
      { slug: 'download-buttons', title: 'Download buttons' },
    ],
  },
  {
    name: 'Headers',
    description:
      'Components for creating headers with different menu layouts and social icons.',
    components: [
      { slug: 'header-with-centered-menu', title: 'Header with centered menu' },
      { slug: 'header-with-side-menu', title: 'Header with side menu' },
      { slug: 'header-with-social-icons', title: 'Header with social icons' },
    ],
  },
  {
    name: 'Footers',
    description: 'Footer components with various column layouts.',
    components: [
      { slug: 'footer-with-one-column', title: 'Footer with one column' },
      { slug: 'footer-with-two-columns', title: 'Footer with two columns' },
    ],
  },
  {
    name: 'Code Block',
    description:
      'Code block components with options for themes, line numbers, and customization.',
    components: [
      {
        slug: 'code-block-with-predefined-theme',
        title: 'Code Block with predefined theme',
      },
      {
        slug: 'code-block-with-line-numbers',
        title: 'Code Block with line numbers',
      },
      {
        slug: 'code-block-with-custom-theme',
        title: 'Code Block with custom theme',
      },
      { slug: 'code-block-without-theme', title: 'Code Block without theme' },
    ],
  },
  {
    name: 'Code Inline',
    description:
      'Inline code components for displaying small code snippets within text.',
    components: [
      { slug: 'simple-code-inline', title: 'Simple Code Inline' },
      {
        slug: 'code-inline-with-different-colors',
        title: 'Code Inline with different colors',
      },
    ],
  },
  {
    name: 'Container',
    description:
      'Container components for wrapping content with different layout options.',
    components: [{ slug: 'simple-container', title: 'Simple container' }],
  },
  {
    name: 'Divider',
    description: 'Divider components to separate content in rows or columns.',
    components: [
      { slug: 'simple-divider', title: 'Simple divider' },
      {
        slug: 'divider-between-rows-and-columns',
        title: 'Divider between rows and columns',
      },
    ],
  },
  {
    name: 'Features',
    description:
      'Feature components for showcasing key features with headers, lists, and columns.',
    components: [
      { slug: 'header-and-list-items', title: 'Header and list items' },
      {
        slug: 'header-and-numbered-list-items',
        title: 'Header and numbered list items',
      },
      {
        slug: 'header-and-four-paragraphs',
        title: 'Header and four paragraphs',
      },
      {
        slug: 'header-and-four-paragraphs-and-two-columns',
        title: 'Header, four paragraphs and two columns',
      },
      {
        slug: 'header-and-three-centered-paragraphs',
        title: 'Header and three centered paragraphs',
      },
    ],
  },
  {
    name: 'Grid',
    description: 'Grid components for arranging content in rows and columns.',
    components: [
      { slug: 'one-row-three-columns', title: 'One row, three columns' },
      { slug: 'one-row-two-columns', title: 'One row, two columns' },
    ],
  },
  {
    name: 'Heading',
    description:
      'Heading components for displaying titles and subtitles with different spacing options.',
    components: [
      { slug: 'simple-heading', title: 'Simple heading' },
      { slug: 'multiple-headings', title: 'Multiple headings' },
    ],
  },
  {
    name: 'Image',
    description:
      'Image components for displaying images with various styling options.',
    components: [
      { slug: 'simple-image', title: 'Simple image' },
      { slug: 'rounded-image', title: 'Rounded image' },
      { slug: 'image-with-varying-sizes', title: 'Image with varying sizes' },
    ],
  },
  {
    name: 'Link',
    description: 'Link components for creating simple and styled links.',
    components: [
      { slug: 'simple-link', title: 'Simple link' },
      { slug: 'link-inline-with-text', title: 'Link inline with text' },
    ],
  },
  {
    name: 'Markdown',
    description:
      'Markdown components for displaying markdown content with custom styles.',
    components: [
      { slug: 'simple-markdown', title: 'Simple markdown' },
      {
        slug: 'markdown-with-container-styles',
        title: 'Markdown with container styles',
      },
      {
        slug: 'markdown-with-custom-styles',
        title: 'Markdown with custom styles',
      },
    ],
  },
  {
    name: 'Marketing',
    description:
      'Marketing components for creating surveys and checkout forms.',
    components: [{ slug: 'survey', title: 'Survey' }],
  },
  {
    name: 'Section',
    description:
      'Section components for dividing content into distinct sections with rows and columns.',
    components: [
      { slug: 'simple-section', title: 'Simple section' },
      {
        slug: 'section-with-rows-and-columns',
        title: 'Section with rows and columns',
      },
    ],
  },
  {
    name: 'Text',
    description:
      'Text components for displaying text with simple and styled formatting.',
    components: [
      { slug: 'simple-text', title: 'Simple text' },
      { slug: 'text-with-styling', title: 'Text with styling' },
    ],
  },
];
