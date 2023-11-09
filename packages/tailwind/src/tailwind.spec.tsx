/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderToStaticMarkup as render } from "react-dom/server";
import { Hr } from "@react-email/hr";
import { Head } from "@react-email/head";
import { Html } from "@react-email/html";
import { Tailwind, TailwindConfig } from ".";

describe("Tailwind component", () => {
  describe("Inline styles", () => {
    it("should render children with inline Tailwind styles", () => {
      const actualOutput = render(
        <Tailwind>
          <div className="bg-white" />
        </Tailwind>,
      );

      expect(actualOutput).not.toBeNull();
    });
  });

  it("should be able to use background image", () => {
    const actualOutput = render(
      <Tailwind>
        <div className="bg-[url(https://example.com/image.png)]" />
      </Tailwind>,
    );

    expect(actualOutput).toMatchInlineSnapshot(
      '"<div style=\\"background-image:url(https://example.com/image.png)\\"></div>"',
    );
  });

  it("should override inline styles with Tailwind styles", () => {
    const actualOutput = render(
      <Tailwind>
        <div
          className="bg-black text-[16px]"
          style={{ backgroundColor: "red", fontSize: "12px" }}
        />
      </Tailwind>,
    );

    expect(actualOutput).toMatchInlineSnapshot(
      '"<div style=\\"background-color:rgb(0 0 0 / 1);font-size:16px\\"></div>"',
    );
  });

  it("should override component styles with Tailwind styles", () => {
    const actualOutput = render(
      <Tailwind>
        <Hr className="w-12" />
      </Tailwind>,
    );

    expect(actualOutput).toContain("width:3rem");
  });
});

describe("Responsive styles", () => {
  it("should add css to <head/>", () => {
    const actualOutput = render(
      <html lang="en">
        <Tailwind>
          <head />
          <body>
            <div className="bg-red-200 sm:bg-red-300 md:bg-red-400 lg:bg-red-500" />
          </body>
        </Tailwind>
      </html>,
    );

    expect(actualOutput).toMatchInlineSnapshot(
      '"<html lang=\\"en\\"><head><style>@media(min-width:640px){.sm\\\\:bg-red-300{background-color:rgb(252 165 165 / 1)}}@media(min-width:768px){.md\\\\:bg-red-400{background-color:rgb(248 113 113 / 1)}}@media(min-width:1024px){.lg\\\\:bg-red-500{background-color:rgb(239 68 68 / 1)}}</style></head><body><div class=\\"sm:bg-red-300 md:bg-red-400 lg:bg-red-500\\" style=\\"background-color:rgb(254 202 202 / 1)\\"></div></body></html>"',
    );
  });

  it("should throw an error when used without a <head/>", () => {
    function noHead() {
      render(
        <html lang="en">
          <Tailwind>
            {/* <Head></Head> */}
            <div className="bg-red-200 sm:bg-red-500" />
          </Tailwind>
        </html>,
      );
    }
    expect(noHead).toThrowErrorMatchingInlineSnapshot(
      `"Tailwind: To use responsive styles you must have a <head> element as a direct child of the Tailwind component."`,
    );
  });

  it("should persist existing <head/> elements", () => {
    const actualOutput = render(
      <html lang="en">
        <Tailwind>
          <head>
            <style />
            <link />
          </head>
          <body>
            <div className="bg-red-200 sm:bg-red-500" />
          </body>
        </Tailwind>
      </html>,
    );

    expect(actualOutput).toMatchInlineSnapshot(
      '"<html lang=\\"en\\"><head><style></style><link/><style>@media(min-width:640px){.sm\\\\:bg-red-500{background-color:rgb(239 68 68 / 1)}}</style></head><body><div class=\\"sm:bg-red-500\\" style=\\"background-color:rgb(254 202 202 / 1)\\"></div></body></html>"',
    );
  });
});

describe("Custom theme config", () => {
  it("should be able to use custom colors", () => {
    const config: TailwindConfig = {
      theme: {
        extend: {
          colors: {
            custom: "#1fb6ff",
          },
        },
      },
    };

    const actualOutput = render(
      <Tailwind config={config}>
        <div className="text-custom bg-custom" />
      </Tailwind>,
    );

    expect(actualOutput).toMatchInlineSnapshot(
      '"<div style=\\"color:rgb(31 182 255 / 1);background-color:rgb(31 182 255 / 1)\\"></div>"',
    );
  });

  it("should be able to use custom fonts", () => {
    const config: TailwindConfig = {
      theme: {
        extend: {
          fontFamily: {
            sans: ["Graphik", "sans-serif"],
            serif: ["Merriweather", "serif"],
          },
        },
      },
    };

    const actualOutput = render(
      <Tailwind config={config}>
        <div className="font-sans" />
        <div className="font-serif" />
      </Tailwind>,
    );

    expect(actualOutput).toMatchInlineSnapshot(
      '"<div style=\\"font-family:Graphik, sans-serif\\"></div><div style=\\"font-family:Merriweather, serif\\"></div>"',
    );
  });

  it("should be able to use custom spacing", () => {
    const config: TailwindConfig = {
      theme: {
        extend: {
          spacing: {
            "8xl": "96rem",
          },
        },
      },
    };
    const actualOutput = render(
      <Tailwind config={config}>
        <div className="m-8xl" />
      </Tailwind>,
    );
    expect(actualOutput).toMatchInlineSnapshot(
      '"<div style=\\"margin:96rem\\"></div>"',
    );
  });

  it("should be able to use custom border radius", () => {
    const config: TailwindConfig = {
      theme: {
        extend: {
          borderRadius: {
            "4xl": "2rem",
          },
        },
      },
    };
    const actualOutput = render(
      <Tailwind config={config}>
        <div className="rounded-4xl" />
      </Tailwind>,
    );
    expect(actualOutput).toMatchInlineSnapshot(
      '"<div style=\\"border-radius:2rem\\"></div>"',
    );
  });

  it("should be able to use custom text alignment", () => {
    const config: TailwindConfig = {
      theme: {
        extend: {
          textAlign: {
            justify: "justify",
          },
        },
      },
    };

    const actualOutput = render(
      <Tailwind config={config}>
        <div className="text-justify" />
      </Tailwind>,
    );

    expect(actualOutput).toMatchInlineSnapshot(
      '"<div style=\\"text-align:justify\\"></div>"',
    );
  });
});

describe("Custom plugins config", () => {
  it("should be able to use custom plugins", () => {
    const config: TailwindConfig = {
      plugins: [
        ({ addUtilities }: any) => {
          const newUtilities = {
            ".border-custom": {
              border: "2px solid",
            },
          };

          addUtilities(newUtilities);
        },
      ],
    };

    const actualOutput = render(
      <Tailwind config={config}>
        <div className="border-custom" />
      </Tailwind>,
    );

    expect(actualOutput).toMatchInlineSnapshot(
      '"<div style=\\"border:2px solid\\"></div>"',
    );
  });

  it("should be able to use custom plugins with responsive styles", () => {
    const config: TailwindConfig = {
      plugins: [
        ({ addUtilities }: any) => {
          const newUtilities = {
            ".border-custom": {
              border: "2px solid",
            },
          };

          addUtilities(newUtilities);
        },
      ],
    };

    const actualOutput = render(
      <html lang="en">
        <Tailwind config={config}>
          <head />
          <body>
            <div className="border-custom sm:border-custom" />
          </body>
        </Tailwind>
      </html>,
    );

    expect(actualOutput).toMatchInlineSnapshot(
      '"<html lang=\\"en\\"><head><style>@media(min-width:640px){.sm\\\\:border-custom{border:2px solid}}</style></head><body><div class=\\"sm:border-custom\\" style=\\"border:2px solid\\"></div></body></html>"',
    );
  });
});

describe("<Tailwind> component", () => {
  it("should preserve mso styles", () => {
    const actualOutput = render(
      <Html>
        <Tailwind>
          <Head />
          <span
            dangerouslySetInnerHTML={{
              __html: `<!--[if mso]><i style="letter-spacing: 10px;mso-font-width:-100%;" hidden>&nbsp;</i><![endif]-->`,
            }}
          />
          <div className="bg-white sm:bg-red-50 sm:text-sm md:text-lg custom-class" />
        </Tailwind>
      </Html>,
    );

    expect(actualOutput).toMatchInlineSnapshot(
      '"<html dir=\\"ltr\\" lang=\\"en\\"><head><meta content=\\"text/html; charset=UTF-8\\" http-equiv=\\"Content-Type\\"/><style>@media(min-width:640px){.sm\\\\:bg-red-50{background-color:rgb(254 242 242 / 1)}.sm\\\\:text-sm{font-size:0.875rem;line-height:1.25rem}}@media(min-width:768px){.md\\\\:text-lg{font-size:1.125rem;line-height:1.75rem}}</style></head><span><!--[if mso]><i style=\\"letter-spacing: 10px;mso-font-width:-100%;\\" hidden>&nbsp;</i><![endif]--></span><div class=\\"sm:bg-red-50 sm:text-sm md:text-lg custom-class\\" style=\\"background-color:rgb(255 255 255 / 1)\\"></div></html>"',
    );
  });

  it("should recognize custom resopnsive screen", () => {
    const config: TailwindConfig = {
      theme: {
        screens: {
          sm: { min: "640px" },
          md: { min: "768px" },
          lg: { min: "1024px" },
          xl: { min: "1280px" },
          "2xl": { min: "1536px" },
        },
      },
    };
    const actualOutput = render(
      <Html>
        <Tailwind config={config}>
          <Head />
          <div className="bg-red-100 xl:bg-green-500">Test</div>
          <div className="2xl:bg-blue-500">Test</div>
        </Tailwind>
      </Html>,
    );

    expect(actualOutput).toMatchInlineSnapshot(
      '"<html dir=\\"ltr\\" lang=\\"en\\"><head><meta content=\\"text/html; charset=UTF-8\\" http-equiv=\\"Content-Type\\"/><style>@media(min-width:1280px){.xl\\\\:bg-green-500{background-color:rgb(34 197 94 / 1)}}@media(min-width:1536px){.\\\\32xl\\\\:bg-blue-500{background-color:rgb(59 130 246 / 1)}}</style></head><div class=\\"xl:bg-green-500\\" style=\\"background-color:rgb(254 226 226 / 1)\\">Test</div><div class=\\"2xl:bg-blue-500\\">Test</div></html>"',
    );
  });

  it("should work with calc() with + sign", () => {
    const actualOutput = render(
      <Tailwind>
        <div className="max-h-[calc(50px+3rem)] bg-red-100">
          <div className="h-[200px]">something tall</div>
        </div>
      </Tailwind>,
    );

    expect(actualOutput).toMatchInlineSnapshot(
      '"<div style=\\"max-height:calc(50px + 3rem);background-color:rgb(254 226 226 / 1)\\"><div style=\\"height:200px\\">something tall</div></div>"',
    );
  });
});
