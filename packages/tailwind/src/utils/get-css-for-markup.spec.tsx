import { renderToStaticMarkup } from "react-dom/server";
import { getCSSForMarkup } from "./get-css-for-markup";
import { minifyCSS } from "./minify-css";

// these tests will fail if the minifyCSS is broken as well
// the reason we use it here is because it just makes it simpler to compare
// generated styles with expected ones
describe('getCSSForMarkup()', () => {
  it('should generate proper CSS for media queries', () => {
    const content = <div className="bg-white dark:bg-black w-screen h-screen grid place-items-center">
      <span>Look at this amazing stuff!</span>
    </div>;
    const markup = renderToStaticMarkup(content);
    const css = getCSSForMarkup(markup, {});

    expect(minifyCSS(css)).toMatchInlineSnapshot(`".grid{display:grid}.h-screen{height:100vh}.w-screen{width:100vw}.place-items-center{place-items:center}.bg-white{background-color:rgb(255 255 255 / 1)}@media(prefers-color-scheme:dark){.dark\\\\:bg-black{background-color:rgb(0 0 0 / 1)}}"`);
  });
});
