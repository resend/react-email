import postcss, { Root } from 'postcss';
import { sanitizeNonInlinableClasses } from './sanitize-non-inlinable-classes';

test('sanitizeNonInlinableClasses()', async () => {
  const { root } = await postcss()
    .process(
      `
.ring-gray-900\\/5{
  --tw-ring-color: rgb(17 24 39 / 0.05)
}
.\\[mask-image\\:linear-gradient\\(180deg\\2c white\\2c rgba\\(255\\2c 255\\2c 255\\2c 0\\)\\)\\]{
  -webkit-mask-image: linear-gradient(180deg,white,rgba(255,255,255,0));
          mask-image: linear-gradient(180deg,white,rgba(255,255,255,0))
}

.hover\\:text-sky-600:hover{
  --tw-text-opacity: 1;
  color: rgb(2 132 199 / var(--tw-text-opacity))
}

@media (min-width: 640px){
  .sm\\:mx-auto{
    margin-left: auto;
    margin-right: auto
  }

  .sm\\:focus\\:outline-none:focus{
    outline: 2px solid transparent;
    outline-offset: 2px
  }

  .sm\\:max-w-lg{
    max-width: 32rem
  }

  .sm\\:rounded-lg{
    border-radius: 0.5rem
  }
}

@media (min-width: 768px){
  .md\\:hover\\:bg-gray-100:hover{
    --tw-bg-opacity: 1;
    background-color: rgb(243 244 246 / var(--tw-bg-opacity))
  }

  .md\\:px-10{
    padding-left: 2.5rem;
    padding-right: 2.5rem
  }

  .md\\:py-12{
    padding-top: 3rem;
    padding-bottom: 3rem
  }
}

@media (min-width: 1024px){
  .lg\\:focus\\:underline:focus{
    text-decoration-line: underline
  }
}
`,
    )
    .async();

  const { nonInlinableClasses, sanitizedRules } = sanitizeNonInlinableClasses(
    root as Root,
  );
  expect(nonInlinableClasses).toEqual([
    'sm:mx-auto',
    'sm:focus:outline-none',
    'sm:max-w-lg',
    'sm:rounded-lg',
    'md:hover:bg-gray-100',
    'md:px-10',
    'md:py-12',
    'lg:focus:underline',
    'hover:text-sky-600',
  ]);
  expect(new Root({ nodes: sanitizedRules }).toString()).toBe(`

@media (min-width: 640px){
  .sm_mx-auto{
    margin-left: auto !important;
    margin-right: auto !important
  }

  .sm_focus_outline-none:focus{
    outline: 2px solid transparent !important;
    outline-offset: 2px !important
  }

  .sm_max-w-lg{
    max-width: 32rem !important
  }

  .sm_rounded-lg{
    border-radius: 0.5rem !important
  }
}

@media (min-width: 768px){
  .md_hover_bg-gray-100:hover{
    --tw-bg-opacity: 1 !important;
    background-color: rgb(243 244 246 / var(--tw-bg-opacity)) !important
  }

  .md_px-10{
    padding-left: 2.5rem !important;
    padding-right: 2.5rem !important
  }

  .md_py-12{
    padding-top: 3rem !important;
    padding-bottom: 3rem !important
  }
}

@media (min-width: 1024px){
  .lg_focus_underline:focus{
    text-decoration-line: underline !important
  }
}

.hover_text-sky-600:hover{
  --tw-text-opacity: 1 !important;
  color: rgb(2 132 199 / var(--tw-text-opacity)) !important
}`);
});
