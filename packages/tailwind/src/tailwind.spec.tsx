/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderToStaticMarkup as render } from "react-dom/server";
import { Hr } from "@react-email/hr";
import { Html } from "@react-email/html";
import { Heading } from "@react-email/heading";
import { Head } from "@react-email/head";
import { Button } from "@react-email/button";
import React from "react";
import { ResponsiveRow, ResponsiveColumn } from "@responsive-email/react-email";
import { Tailwind } from ".";
import type { TailwindConfig } from ".";

describe("Tailwind component", () => {
  it("should allow for complex children manipulation", () => {
    const actualOutput = render(
      <Tailwind>
        <ResponsiveRow>
          <ResponsiveColumn>This is the first column</ResponsiveColumn>
          <ResponsiveColumn>This is the second column</ResponsiveColumn>
        </ResponsiveRow>
      </Tailwind>,
    );
    expect(actualOutput).toMatchSnapshot();
  });

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

  test('<Button className="px-3 py-2 mt-8 text-sm text-gray-200 bg-blue-600 rounded-md">', () => {
    const actualOutput = render(
      <Tailwind>
        <Button className="px-3 py-2 mt-8 text-sm text-gray-200 bg-blue-600 rounded-md">
          Testing button
        </Button>
        Testing
      </Tailwind>,
    );

    expect(actualOutput).toMatchSnapshot();
  });

  it("should work with custom components with fragment at the root", () => {
    const Wrapper = (props: { children: React.ReactNode }) => {
      return <Tailwind>{props.children}</Tailwind>;
    };

    const Brand = () => {
      return (
        <>
          <div className="p-[20px]">
            <p className="font-bold text-[50px]">React Email</p>
          </div>
          <div className="p-[20px]">
            <p className="font-bold text-[50px]">React Email</p>
          </div>
        </>
      );
    };

    const EmailTemplate = () => {
      return (
        <Wrapper>
          <div className="text-[50px] leading-[1] mt-[100px]">Hello world</div>
          <Brand />
        </Wrapper>
      );
    };

    const actualOutput = render(EmailTemplate());

    expect(actualOutput).toMatchInlineSnapshot(
      `"<div style=\\"font-size:50px;line-height:1;margin-top:100px\\">Hello world</div><div style=\\"padding:20px\\"><p style=\\"font-weight:700;font-size:50px\\">React Email</p></div><div style=\\"padding:20px\\"><p style=\\"font-weight:700;font-size:50px\\">React Email</p></div>"`,
    );
  });

  test("it should not generate styles from text", () => {
    expect(render(<Tailwind>container bg-red-500 bg-blue-300</Tailwind>)).toBe(
      "container bg-red-500 bg-blue-300",
    );
  });

  it("should work with components that return children", () => {
    const Wrapper = (props: { children: React.ReactNode }) => {
      return <Tailwind>{props.children}</Tailwind>;
    };

    const Brand = () => {
      return (
        <div className="p-[20px]">
          <p className="font-bold text-[50px]">React Email</p>
        </div>
      );
    };

    const EmailTemplate = () => {
      return (
        <Wrapper>
          <div className="text-[50px] leading-[1] mt-[100px]">Hello world</div>
          <Brand />
        </Wrapper>
      );
    };

    const actualOutput = render(EmailTemplate());

    expect(actualOutput).toMatchInlineSnapshot(
      `"<div style=\\"font-size:50px;line-height:1;margin-top:100px\\">Hello world</div><div style=\\"padding:20px\\"><p style=\\"font-weight:700;font-size:50px\\">React Email</p></div>"`,
    );
  });

  it("should work with Heading component", () => {
    const EmailTemplate = () => {
      return (
        <Tailwind>
          Hello
          <Heading>My testing heading</Heading>
          friends
        </Tailwind>
      );
    };

    expect(render(<EmailTemplate />)).toMatchSnapshot();
  });

  it("should work with components that use React.forwardRef", () => {
    const Wrapper = (props: { children: React.ReactNode }) => {
      return <Tailwind>{props.children}</Tailwind>;
    };

    const Brand = React.forwardRef<HTMLDivElement>((ref, props) => {
      return (
        <div
          className="p-[20px]"
          ref={ref as React.LegacyRef<HTMLDivElement>}
          {...props}
        >
          <p className="font-bold text-[50px]">React Email</p>
        </div>
      );
    });
    Brand.displayName = "Brand";

    const EmailTemplate = () => {
      return (
        <Wrapper>
          <div className="text-[50px] leading-[1] mt-[100px]">Hello world</div>
          <Brand />
        </Wrapper>
      );
    };

    const actualOutput = render(EmailTemplate());

    expect(actualOutput).toMatchInlineSnapshot(
      `"<div style=\\"font-size:50px;line-height:1;margin-top:100px\\">Hello world</div><div style=\\"padding:20px\\"><p style=\\"font-weight:700;font-size:50px\\">React Email</p></div>"`,
    );
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
      '"<div style=\\"background-color:rgb(0,0,0);font-size:16px\\"></div>"',
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
      '"<html dir=\\"ltr\\" lang=\\"en\\"><head><meta content=\\"text/html; charset=UTF-8\\" http-equiv=\\"Content-Type\\"/><meta name=\\"x-apple-disable-message-reformatting\\"/><style>@media(min-width:640px){.sm_bg-red-50{background-color:rgb(254,242,242)!important}.sm_text-sm{font-size:0.875rem!important;line-height:1.25rem!important}}@media(min-width:768px){.md_text-lg{font-size:1.125rem!important;line-height:1.75rem!important}}</style></head><span><!--[if mso]><i style=\\"letter-spacing: 10px;mso-font-width:-100%;\\" hidden>&nbsp;</i><![endif]--></span><div class=\\"sm_bg-red-50 sm_text-sm md_text-lg custom-class\\" style=\\"background-color:rgb(255,255,255)\\"></div></html>"',
    );
  });

  it("should recognize custom responsive screen", () => {
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
      '"<html dir=\\"ltr\\" lang=\\"en\\"><head><meta content=\\"text/html; charset=UTF-8\\" http-equiv=\\"Content-Type\\"/><meta name=\\"x-apple-disable-message-reformatting\\"/><style>@media(min-width:1280px){.xl_bg-green-500{background-color:rgb(34,197,94)!important}}@media(min-width:1536px){.2xl_bg-blue-500{background-color:rgb(59,130,246)!important}}</style></head><div class=\\"xl_bg-green-500\\" style=\\"background-color:rgb(254,226,226)\\">Test</div><div class=\\"2xl_bg-blue-500\\">Test</div></html>"',
    );
  });

  it("should work with calc() with + sign", () => {
    const actualOutput = render(
      <Tailwind>
        <head />
        <div className="max-h-[calc(50px+3rem)] lg:max-h-[calc(50px+5rem)] bg-red-100">
          <div className="h-[200px]">something tall</div>
        </div>
      </Tailwind>,
    );

    expect(actualOutput).toMatchInlineSnapshot(
      '"<head><style>@media(min-width:1024px){.lg_max-h-calc50pxplus5rem{max-height:calc(50px + 5rem)!important}}</style></head><div class=\\"lg_max-h-calc50pxplus5rem\\" style=\\"max-height:calc(50px + 3rem);background-color:rgb(254,226,226)\\"><div style=\\"height:200px\\">something tall</div></div>"',
    );
  });
});

describe("Responsive styles", () => {
  /*
    This test is because of https://github.com/resend/react-email/issues/1112
    which was being caused because we required to, either have our <Head> component,
    or a <head> element directly inside the <Tailwind> component for media queries to be applied
    onto. The problem with this approach was that the check to see if an element was an instance of
    the <Head> component fails after minification as we did it by the function name.

    The best solution is to check for the Head element on arbitrarily deep levels of the React tree
    and apply the styles there. This also fixes the issue where it would not be allowed to use
    Tailwind classes on the <html> element as the <head> would be required directly bellow Tailwind.
  */
  it("should work with arbitrarily deep (in the React tree) <head> elements", () => {
    expect(
      render(
        <Tailwind>
          <html lang="en">
            <head />
            <body>
              <div className="bg-red-200 sm:bg-red-300 md:bg-red-400 lg:bg-red-500" />
            </body>
          </html>
        </Tailwind>,
      ),
    ).toMatchInlineSnapshot(
      '"<html lang=\\"en\\"><head><style>@media(min-width:640px){.sm_bg-red-300{background-color:rgb(252,165,165)!important}}@media(min-width:768px){.md_bg-red-400{background-color:rgb(248,113,113)!important}}@media(min-width:1024px){.lg_bg-red-500{background-color:rgb(239,68,68)!important}}</style></head><body><div class=\\"sm_bg-red-300 md_bg-red-400 lg_bg-red-500\\" style=\\"background-color:rgb(254,202,202)\\"></div></body></html>"',
    );

    const MyHead = (props: Record<string, any>) => {
      return <head {...props} />;
    };

    expect(
      render(
        <Tailwind>
          <html lang="en">
            <MyHead />
            <body>
              <div className="bg-red-200 sm:bg-red-300 md:bg-red-400 lg:bg-red-500" />
            </body>
          </html>
        </Tailwind>,
      ),
    ).toMatchInlineSnapshot(
      '"<html lang=\\"en\\"><head><style>@media(min-width:640px){.sm_bg-red-300{background-color:rgb(252,165,165)!important}}@media(min-width:768px){.md_bg-red-400{background-color:rgb(248,113,113)!important}}@media(min-width:1024px){.lg_bg-red-500{background-color:rgb(239,68,68)!important}}</style></head><body><div class=\\"sm_bg-red-300 md_bg-red-400 lg_bg-red-500\\" style=\\"background-color:rgb(254,202,202)\\"></div></body></html>"',
    );
  });

  it("should add css to <head/> and keep responsive class names", () => {
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
      '"<html lang=\\"en\\"><head><style>@media(min-width:640px){.sm_bg-red-300{background-color:rgb(252,165,165)!important}}@media(min-width:768px){.md_bg-red-400{background-color:rgb(248,113,113)!important}}@media(min-width:1024px){.lg_bg-red-500{background-color:rgb(239,68,68)!important}}</style></head><body><div class=\\"sm_bg-red-300 md_bg-red-400 lg_bg-red-500\\" style=\\"background-color:rgb(254,202,202)\\"></div></body></html>"',
    );
  });

  it("should work with relatively complex media query utilities", () => {
    const Email = () => {
      return (
        <Tailwind>
          <Head />
          <p className="text-blue-700 max-sm:text-red-600">I am some text</p>
        </Tailwind>
      );
    };

    expect(render(<Email />)).toMatchSnapshot();
  });

  it("should throw an error when used without a <head/>", () => {
    function noHead() {
      render(
        <Tailwind>
          <html lang="en">
            {/* <Head></Head> */}
            <div className="bg-red-200 sm:bg-red-500" />
          </html>
        </Tailwind>,
      );
    }
    expect(noHead).toThrowErrorMatchingSnapshot();
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
      '"<html lang=\\"en\\"><head><style></style><link/><style>@media(min-width:640px){.sm_bg-red-500{background-color:rgb(239,68,68)!important}}</style></head><body><div class=\\"sm_bg-red-500\\" style=\\"background-color:rgb(254,202,202)\\"></div></body></html>"',
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
      '"<div style=\\"color:rgb(31,182,255);background-color:rgb(31,182,255)\\"></div>"',
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
      '"<html lang=\\"en\\"><head><style>@media(min-width:640px){.sm_border-custom{border:2px solid!important}}</style></head><body><div class=\\"sm_border-custom\\" style=\\"border:2px solid\\"></div></body></html>"',
    );
  });
});
