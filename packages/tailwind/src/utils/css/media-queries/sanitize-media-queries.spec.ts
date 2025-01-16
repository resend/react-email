import postcss, { Root } from 'postcss';
import { sanitizeMediaQueries } from './sanitize-media-queries';

test('sanitizeMediaQueries()', async () => {
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

  .hover\\:text-sky-600:hover{
    --tw-text-opacity: 1;
    color: rgb(2 132 199 / var(--tw-text-opacity))
  }

  .sm\\:max-w-lg{
    max-width: 32rem
  }

  .sm\\:rounded-lg{
    border-radius: 0.5rem
  }

  .sm\\:px-10{
    padding-left: 2.5rem;
    padding-right: 2.5rem
  }

  .sm\\:py-12{
    padding-top: 3rem;
    padding-bottom: 3rem
  }
}
`,
    )
    .async();

  const { mediaQueryClasses, sanitizedAtRules } = sanitizeMediaQueries(
    root as Root,
  );
  expect(mediaQueryClasses).toEqual([
    'sm:mx-auto',
    'sm:max-w-lg',
    'sm:rounded-lg',
    'sm:px-10',
    'sm:py-12',
  ]);
  expect(new Root({ nodes: sanitizedAtRules }).toString()).toBe(`
@media (min-width: 640px){
  .sm_mx-auto{
    margin-left: auto !important;
    margin-right: auto !important
  }

  .sm_max-w-lg{
    max-width: 32rem !important
  }

  .sm_rounded-lg{
    border-radius: 0.5rem !important
  }

  .sm_px-10{
    padding-left: 2.5rem !important;
    padding-right: 2.5rem !important
  }

  .sm_py-12{
    padding-top: 3rem !important;
    padding-bottom: 3rem !important
  }
}`);
});
