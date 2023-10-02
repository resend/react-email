/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { renderToStaticMarkup as render } from "react-dom/server";
import type { TailwindConfig } from "tw-to-css";
import { Button } from "@react-email/button";
import { Tailwind } from "./tailwind";

describe("Tailwind component", () => {
  describe("Inline styles", () => {
    it("should render children with inline Tailwind styles", () => {
      const actualOutput = render(
        <Tailwind>
          <div className="bg-black text-white" />
        </Tailwind>,
      );

      expect(actualOutput).toMatchInlineSnapshot(
        '"<div style=\\"background-color:rgb(0,0,0);color:rgb(255,255,255)\\"></div>"',
      );
    });

    it("should be able to use background image", () => {
      const actualOutput = render(
        <Tailwind>
          <div className="bg-[url(https://react.email/static/covers/tailwind.png)]" />
        </Tailwind>,
      );

      expect(actualOutput).toMatchInlineSnapshot(
        '"<div style=\\"background-image:url(https://react.email/static/covers/tailwind.png)\\"></div>"',
      );
    });

    it("should override inline styles with Tailwind styles", () => {
      const actualOutput = render(
        <Tailwind>
          <div
            className="bg-black text-[16px]"
            style={{ fontSize: "12px", backgroundColor: "red" }}
          />
        </Tailwind>,
      );

      expect(actualOutput).toMatchInlineSnapshot(
        '"<div style=\\"font-size:16px;background-color:rgb(0,0,0)\\"></div>"',
      );
    });

    it("should override component styles with Tailwind styles", () => {
      const actualOutput = render(
        <Tailwind>
          <Button className="py-3 px-6" />
        </Tailwind>,
      );

      expect(actualOutput).toContain(
        "padding:0px 0px;padding-top:0.75rem;padding-bottom:0.75rem;padding-left:1.5rem;padding-right:1.5rem",
      );
    });
  });

  describe("Responsive styles", () => {
    it("should add css to <head/>", () => {
      const actualOutput = render(
        <Tailwind>
          <html lang="en">
            <head />
            <body>
              <div className="bg-red-200 sm:bg-red-300 md:bg-red-400 lg:bg-red-500" />
            </body>
          </html>
        </Tailwind>,
      );

      expect(actualOutput).toMatchInlineSnapshot(
        '"<html lang=\\"en\\"><head><style>@media(min-width:640px){.sm_bg_red_300{background-color: rgb(252,165,165) !important;}}@media(min-width:768px){.md_bg_red_400{background-color: rgb(248,113,113) !important;}}@media(min-width:1024px){.lg_bg_red_500{background-color: rgb(239,68,68) !important;}}</style></head><body><div class=\\"sm_bg_red_300 md_bg_red_400 lg_bg_red_500\\" style=\\"background-color:rgb(254,202,202)\\"></div></body></html>"',
      );
    });

    it("should throw an error when used without either <html/> or <head/> tags", () => {
      function noHtmlOrHead() {
        render(
          <Tailwind>
            <div className="bg-red-200 sm:bg-red-500" />
          </Tailwind>,
        );
      }
      expect(noHtmlOrHead).toThrowErrorMatchingInlineSnapshot(
        `"Tailwind: To use responsive styles you must have a <html> and <head> element in your template."`,
      );

      function noHtml() {
        render(
          <Tailwind>
            <head>
              <title>Test</title>
            </head>
            <div className="bg-red-200 sm:bg-red-500" />
          </Tailwind>,
        );
      }
      expect(noHtml).toThrowErrorMatchingInlineSnapshot(
        `"Tailwind: To use responsive styles you must have a <html> and <head> element in your template."`,
      );

      function noHead() {
        render(
          <Tailwind>
            <html lang="en">
              <div className="bg-red-200 sm:bg-red-500" />
            </html>
          </Tailwind>,
        );
      }
      expect(noHead).toThrowErrorMatchingInlineSnapshot(
        `"Tailwind: To use responsive styles you must have a <html> and <head> element in your template."`,
      );
    });

    it("should persist exsisting <head/> elements", () => {
      const actualOutput = render(
        <Tailwind>
          <html lang="en">
            <head>
              <style />
              <link />
            </head>
            <body>
              <div className="bg-red-200 sm:bg-red-500" />
            </body>
          </html>
        </Tailwind>,
      );

      expect(actualOutput).toMatchInlineSnapshot(
        '"<html lang=\\"en\\"><head><style></style><link/><style>@media(min-width:640px){.sm_bg_red_500{background-color: rgb(239,68,68) !important;}}</style></head><body><div class=\\"sm_bg_red_500\\" style=\\"background-color:rgb(254,202,202)\\"></div></body></html>"',
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

    it("should be able to use custom colors", () => {
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
      const actualOutput = render(
        <Tailwind
          config={{
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
          }}
        >
          <div className="border-custom" />
        </Tailwind>,
      );

      expect(actualOutput).toMatchInlineSnapshot(
        '"<div style=\\"border:2px solid\\"></div>"',
      );
    });

    it("should be able to use custom plugins with responsive styles", () => {
      const actualOutput = render(
        <Tailwind
          config={{
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
          }}
        >
          <html lang="en">
            <head />
            <body>
              <div className="border-custom sm:border-custom" />
            </body>
          </html>
        </Tailwind>,
      );

      expect(actualOutput).toMatchInlineSnapshot(
        '"<html lang=\\"en\\"><head><style>@media(min-width:640px){.sm_border_custom{border: 2px solid !important;}}</style></head><body><div class=\\"sm_border_custom\\" style=\\"border:2px solid\\"></div></body></html>"',
      );
    });
  });
  describe("Class name replacement", () => {
    it("should replace forward slash with underscore in both class name and selector", () => {
      const actualOutput = render(
        <Tailwind>
          <html lang="en">
            <head />
            <body>
              <div className="w-full" />
              <div className="w-1/2 sm:w-1/2" />
            </body>
          </html>
        </Tailwind>,
      );
      expect(actualOutput).toMatchInlineSnapshot(
        '"<html lang=\\"en\\"><head><style>@media(min-width:640px){.sm_w_1_2{width: 50% !important;}}</style></head><body><div style=\\"width:100%\\"></div><div class=\\"sm_w_1_2\\" style=\\"width:50%\\"></div></body></html>"',
      );
    });
    it("should replace period with underscore in both class name and selector", () => {
      const actualOutput = render(
        <Tailwind>
          <html lang="en">
            <head />
            <body>
              <div className="w-1.5" />
              <div className="w-1.5 sm:w-1.5" />
            </body>
          </html>
        </Tailwind>,
      );
      expect(actualOutput).toMatchInlineSnapshot(
        '"<html lang=\\"en\\"><head><style>@media(min-width:640px){.sm_w_1{width: 0.25rem !important;}.sm_w_1_5{width: 0.375rem !important;}}</style></head><body><div style=\\"width:0.375rem\\"></div><div class=\\"sm_w_1_5\\" style=\\"width:0.375rem\\"></div></body></html>"',
      );
    });
    it("should replace percent signs with underscore in both class name and selector", () => {
      const actualOutput = render(
        <Tailwind>
          <html lang="en">
            <head />
            <body>
              <div className="w-[50%]" />
              <div className="w-[50%] sm:w-[50%]" />
            </body>
          </html>
        </Tailwind>,
      );
      expect(actualOutput).toMatchInlineSnapshot(
        '"<html lang=\\"en\\"><head><style>@media(min-width:640px){.sm_w_50_{width: 50% !important;}}</style></head><body><div style=\\"width:50%\\"></div><div class=\\"sm_w_50_\\" style=\\"width:50%\\"></div></body></html>"',
      );
    });
  });
});
