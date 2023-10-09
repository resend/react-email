import { cleanCss, getMediaQueryCss, makeCssMap } from ".";

describe("getMediaQueryCss function", () => {
  it("should add !important to all CSS properties within media queries", () => {
    const css = `@media (max-width: 768px){.text-sm{font-size: 14px}}`;

    const modifiedCss = getMediaQueryCss(css);

    const expectedCSS = `@media (max-width: 768px){.text-sm{font-size: 14px !important;}}`;

    expect(modifiedCss).toEqual(expectedCSS);
  });

  it("should handle CSS with multiple media queries", () => {
    const css = `@media (max-width: 640px){.text-sm{font-size: 12px}}@media (max-width: 768px){.text-sm{font-size: 14px}}`;

    const modifiedCss = getMediaQueryCss(css);

    const expectedCSS = `@media (max-width: 640px){.text-sm{font-size: 12px !important;}}@media (max-width: 768px){.text-sm{font-size: 14px !important;}}`;

    expect(modifiedCss).toEqual(expectedCSS);
  });

  it("should handle empty CSS string", () => {
    const css = "";

    const modifiedCss = getMediaQueryCss(css);

    expect(modifiedCss).toEqual("");
  });

  it("should not modify CSS without media queries", () => {
    const css = `.regular-class{font-size: 16px;}`;

    const modifiedCss = getMediaQueryCss(css);

    expect(modifiedCss).toEqual("");
  });
});

describe("makeCssMap function", () => {
  it("should create a map of class names and their corresponding styles", () => {
    const css = `.my-class{font-weight: bold; color: red;}.other-class{font-weight: normal;background-color: blue;}`;

    const cssMap = makeCssMap(css);

    expect(cssMap).toEqual({
      ".my-class": "font-weight: bold; color: red;",
      ".other-class": "font-weight: normal;background-color: blue;",
    });
  });

  it("should handle only CSS without media queries", () => {
    const css = `.my-class{font-weight: bold;color: red;}@media (max-width: 768px) {.responsive-class{font-size: 14px;line-height: 1.5;}}`;

    const cssMap = makeCssMap(css);

    expect(cssMap).toEqual({
      ".my-class": "font-weight: bold;color: red;",
    });
  });

  it("should pick the recent styles from duplicate class names", () => {
    const css = `.my-class{font-weight: bold;color: red;}.my-class{font-style: italic;}`;

    const cssMap = makeCssMap(css);

    expect(cssMap).toEqual({
      ".my-class": "font-style: italic;",
    });
  });

  it("should handle empty CSS string", () => {
    const css = "";

    const cssMap = makeCssMap(css);

    expect(cssMap).toEqual({});
  });
});

describe("cleanCss function", () => {
  it("should replace non-alphanumeric characters in selectors with underscores", () => {
    const inputCss = `
        .my-class {
          background-color: red;
        }
        #myId {
          font-size: 16px;
        }
      `;

    const expectedCss = `
        .my_class {
          background-color: red;
        }
        #myId {
          font-size: 16px;
        }
      `;

    expect(cleanCss(inputCss)).toBe(expectedCss);
  });

  it("should handle CSS with escaped characters", () => {
    const inputCss = `
        .escaped\\:class {
          font-weight: bold;
        }
      `;

    const expectedCss = `
        .escaped_class {
          font-weight: bold;
        }
      `;

    expect(cleanCss(inputCss)).toBe(expectedCss);
  });

  it("should preserve font-family values with single or double quotes", () => {
    const inputCss = `
        .my-class {
          font-family: 'Arial';
        }
        #myId {
          font-family: "Helvetica";
        }
      `;

    const expectedCss = `
        .my_class {
          font-family: Arial;
        }
        #myId {
          font-family: Helvetica;
        }
      `;

    expect(cleanCss(inputCss)).toBe(expectedCss);
  });
});
