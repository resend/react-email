import { cleanCss } from "./clean-css";

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
