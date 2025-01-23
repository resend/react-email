import postcss, { Root } from 'postcss';
import { sanitizePseudoClasses } from './sanitize-pseudo-classes';

test('sanitizePseudoClasses()', async () => {
  const { root } = await postcss()
    .process(
      `
.hover\\:text-sky-600:hover{
  --tw-text-opacity: 1;
  color: rgb(2 132 199 / var(--tw-text-opacity))
}

.focus\\:outline-none:focus{
  outline: 2px solid transparent;
  outline-offset: 2px
}

.hover\\:bg-gray-100:hover{
  --tw-bg-opacity: 1;
  background-color: rgb(243 244 246 / var(--tw-bg-opacity))
}

@media (min-width: 640px){
  .sm\\:mx-auto{
    margin-left: auto;
    margin-right: auto
  }

  .hover\\:text-gray-100:hover{
    --tw-text-opacity: 1;
    color: rgb(243 244 246 / var(--tw-text-opacity))
  }

  .hover\\:underline:hover{
    text-decoration-line: underline
  }
}
`,
    )
    .async();

  const { pseudoClassClasses, sanitizedPseudoClassRules } =
    sanitizePseudoClasses(root as Root);

  expect(pseudoClassClasses).toEqual([
    'hover:text-gray-100',
    'hover:underline',
    'hover:text-sky-600',
    'focus:outline-none',
    'hover:bg-gray-100',
  ]);

  expect(new Root({ nodes: sanitizedPseudoClassRules }).toString()).toBe(`

@media (min-width: 640px){

  .hover_text-gray-100:hover{
    --tw-text-opacity: 1 !important;
    color: rgb(243 244 246 / var(--tw-text-opacity)) !important
  }

  .hover_underline:hover{
    text-decoration-line: underline !important
  }
}
.hover_text-sky-600:hover{
  --tw-text-opacity: 1 !important;
  color: rgb(2 132 199 / var(--tw-text-opacity)) !important
}
.focus_outline-none:focus{
  outline: 2px solid transparent !important;
  outline-offset: 2px !important
}
.hover_bg-gray-100:hover{
  --tw-bg-opacity: 1 !important;
  background-color: rgb(243 244 246 / var(--tw-bg-opacity)) !important
}`);
});
