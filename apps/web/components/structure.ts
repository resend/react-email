import path from "node:path";

// This function should be called when building
// as the components page should be SSG'ed, so the sure fire
// way to get the path to the actual `.tsx` components is
// by going with the CWD
export const pathToComponents = path.resolve(process.cwd(), "./components");

export interface Category {
  name: string;
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
    name: "Articles",
    components: [
      {
        slug: "article-with-image",
        title: "Article with image",
      },
      {
        slug: "article-with-image-as-background",
        title: "Article with image as background",
      },
      {
        slug: "article-with-image-on-right",
        title: "Article with image on right",
      },
      {
        slug: "article-with-two-cards",
        title: "Article with two cards",
      },
    ],
  },
  {
    name: "Buttons",
    components: [
      {
        slug: "button",
        title: "Button",
      },
      {
        slug: "download-app-buttons",
        title: "Download app buttons",
      },
      {
        slug: "two-buttons",
        title: "Two buttons",
      },
    ],
  },
  {
    name: "Headers",
    components: [
      {
        slug: "header-with-centered-menu",
        title: "header with centered menu",
      },
      {
        slug: "header-with-menu",
        title: "Header with menu",
      },
      {
        slug: "header-with-social-icons",
        title: "Header with social icons",
      },
    ],
  },
  {
    name: "Footers",
    components: [
      {
        slug: "footer-with-one-column",
        title: "Footer with one column",
      },
      {
        slug: "footer-with-two-columns",
        title: "Footer with two columns",
      },
    ],
  },
  {
    name: "Code Block",
    components: [
      {
        slug: "code-block-with-custom-theme",
        title: "Code Block with custom theme",
      },
      {
        slug: "code-block-with-line-numbers",
        title: "Code Block with line numbers",
      },
      {
        slug: "code-block-with-predefined-theme",
        title: "Code Block with predefined theme",
      },
      {
        slug: "code-block-without-theme",
        title: "Code Block without theme",
      },
    ],
  },
  {
    name: "Code Inline",
    components: [
      {
        slug: "code-inline-with-different-colors",
        title: "Code Inline with different colors",
      },
      {
        slug: "simple-code-inline",
        title: "Simple Code Inline",
      },
    ],
  },
  {
    name: "Container",
    components: [
      {
        slug: "simple-container",
        title: "Simpler container",
      },
      {
        slug: "container-with-section",
        title: "Container with section",
      },
    ],
  },
  {
    name: "Divider",
    components: [
      {
        slug: "divider-between-rows-and-columns",
        title: "Divider between rows and columns",
      },
      {
        slug: "simple-hr",
        title: "Simple Hr",
      },
    ],
  },
  {
    name: "Ecommerce",
    components: [
      {
        slug: "one-product",
        title: "One product",
      },
      {
        slug: "one-product-with-image-on-the-left",
        title: "One product with iamge on the left",
      },
      {
        slug: "title-four-cards",
        title: "Title + four cards",
      },
      {
        slug: "title-three-cards-in-a-row",
        title: "Title + three cards in a row",
      },
    ],
  },
  {
    name: "Features",
    components: [
      {
        slug: "header-and-four-paragraphs",
        title: "Header and four paragraphs",
      },
      {
        slug: "header-and-four-paragraphs-and-two-columns",
        title: "Header, four paragraphs and two columns",
      },
      {
        slug: "header-and-list-items",
        title: "Header and list items",
      },
      {
        slug: "header-and-numbered-list-items",
        title: "Header and numbered list items",
      },
      {
        slug: "header-and-three-centered-paragraphs",
        title: "Header and three cnetered paragraphs",
      },
    ],
  },
  {
    name: "Gallery",
    components: [
      {
        slug: "four-images-in-a-grid",
        title: "Four images in a grid",
      },
      {
        slug: "images-on-horizontal-grid",
        title: "Images on horizontal grid",
      },
      {
        slug: "images-on-vertical-grid",
        title: "Images on vertical grid",
      },
      {
        slug: "three-columns-with-images",
        title: "Three columns with images",
      },
    ],
  },
  {
    name: "Grid",
    components: [
      {
        slug: "one-row-three-columns",
        title: "One row, three columns",
      },
      {
        slug: "one-row-two-columns",
        title: "One row, two columns",
      },
    ],
  },
  {
    name: "Heading",
    components: [
      {
        slug: "single-heading",
        title: "Single heading",
      },
      {
        slug: "multiple-headings",
        title: "Multiple heading",
      },
      {
        slug: "headings-with-spacing",
        title: "Headings with spacing",
      },
    ],
  },
  {
    name: "Image",
    components: [
      {
        slug: "simple-image",
        title: "Simple image",
      },
      {
        slug: "rounded-image",
        title: "Rounded image",
      },
      {
        slug: "image-with-varying-sizes",
        title: "Image with varying sizes",
      },
    ],
  },
  {
    name: "Link",
    components: [
      {
        slug: "simple-link",
        title: "Simple link",
      },
      {
        slug: "link-inline-with-text",
        title: "Link inline with text",
      },
    ],
  },
  {
    name: "Markdown",
    components: [
      {
        slug: "simple-markdown",
        title: "Simple markdown",
      },
      {
        slug: "markdown-with-container-styles",
        title: "Markdown with container styles",
      },
      {
        slug: "markdown-with-custom-styles",
        title: "Markdown with custom styles",
      },
    ],
  },
  {
    name: "Marketing",
    components: [
      {
        slug: "survey",
        title: "Survey",
      },
      {
        slug: "checkout",
        title: "Checkout",
      },
    ],
  },
  {
    name: "Section",
    components: [
      {
        slug: "simple-section",
        title: "Simple section",
      },
      {
        slug: "section-with-rows-and-columns",
        title: "Section with rows and columns",
      },
    ],
  },
  {
    name: "Text",
    components: [
      {
        slug: "simple-text",
        title: "Simple text",
      },
      {
        slug: "text-with-styling",
        title: "Text with styling",
      },
    ],
  },
];
