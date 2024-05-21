import { separateMediaQueriesFromCSS } from "./separate-media-queries-from-css";

test("separateMediaQueriesFromCSS()", () => {
  const [cssWithoutMediaQueries, mediaQueries] = separateMediaQueriesFromCSS(`
.text-blue-700 {
  --tw-text-opacity: 1;
  color: rgb(29 78 216 / var(--tw-text-opacity));
}
@media not all and (min-width: 640px) {
  .max-sm\\:text-red-600 {
    --tw-text-opacity: 1;
    color: rgb(220 38 38 / var(--tw-text-opacity));
  }
}
@media (min-width: 640px) {
  .sm\\:text-blue-400 {
    --tw-text-opacity: 1;
    color: rgb(96 165 250 / var(--tw-text-opacity));
  }
}
  `);

  expect(cssWithoutMediaQueries.trim()).toBe(`.text-blue-700 {
  --tw-text-opacity: 1;
  color: rgb(29 78 216 / var(--tw-text-opacity));
}`);

  expect(mediaQueries).toEqual([
    `@media not all and (min-width: 640px) {
  .max-sm\\:text-red-600 {
    --tw-text-opacity: 1;
    color: rgb(220 38 38 / var(--tw-text-opacity));
  }
}`,
    `@media (min-width: 640px) {
  .sm\\:text-blue-400 {
    --tw-text-opacity: 1;
    color: rgb(96 165 250 / var(--tw-text-opacity));
  }
}`,
  ]);
});
