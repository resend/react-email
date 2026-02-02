import { Body } from '@react-email/body';
import { Button } from '@react-email/button';
import { Head } from '@react-email/head';
import { Heading } from '@react-email/heading';
import { Hr } from '@react-email/hr';
import { Html } from '@react-email/html';
import { Link } from '@react-email/link';
import { pretty, render } from '@react-email/render';
import { ResponsiveColumn, ResponsiveRow } from '@responsive-email/react-email';
import React from 'react';
import plugin from 'tailwindcss/plugin';
import type { TailwindConfig } from '.';
import { Tailwind } from '.';

describe('Tailwind component', () => {
  it('allows for complex children manipulation', async () => {
    const actualOutput = await render(
      <Tailwind>
        <ResponsiveRow>
          <ResponsiveColumn>This is the first column</ResponsiveColumn>
          <ResponsiveColumn>This is the second column</ResponsiveColumn>
        </ResponsiveRow>
      </Tailwind>,
    );
    expect(actualOutput).toMatchInlineSnapshot(
      `"<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><!--$--><table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="text-align:center;font-size:0"><tbody><tr><td style="padding:0px 0px 0px 0px"><table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:300px;display:inline-block;vertical-align:top;font-size:16px;box-sizing:border-box"><tbody><tr><td>This is the first column</td></tr></tbody></table><table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:300px;display:inline-block;vertical-align:top;font-size:16px;box-sizing:border-box"><tbody><tr><td>This is the second column</td></tr></tbody></table></td></tr></tbody></table><!--/$-->"`,
    );
  });

  it('works with blocklist', async () => {
    const actualOutput = await render(
      <Tailwind
        config={{
          blocklist: ['bg-blue-600'],
        }}
      >
        <Head />
        <body>
          <button type="button" className="bg-blue-600 md:p-4">
            Click me
          </button>
        </body>
      </Tailwind>,
      { pretty: true },
    );

    expect(actualOutput).toMatchInlineSnapshot(`
      "<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <head>
        <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
        <meta name="x-apple-disable-message-reformatting" />
        <!--$-->
        <style>
          .md_p-4{@media (width>=48rem){padding:1rem!important}}
        </style>
      </head>
      <body>
        <button type="button" class="bg-blue-600 md_p-4">Click me</button
        ><!--/$-->
      </body>
      "
    `);
  });

  it('works with shadows', async () => {
    expect(
      await render(
        <Tailwind>
          <div className="shadow-[#555] shadow">shadow around here</div>
        </Tailwind>,
      ).then(pretty),
    ).toMatchInlineSnapshot(`
      "<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <!--$-->
      <div
        style="box-shadow:0 0 rgb(0,0,0,0),0 0 rgb(0,0,0,0),0 0 rgb(0,0,0,0),0 0 rgb(0,0,0,0),0 1px 3px 0 rgb(85,85,85,100%),0 1px 2px -1px rgb(85,85,85,100%)">
        shadow around here
      </div>
      <!--/$-->
      "
    `);
  });

  it('works with class manipulation done on components', async () => {
    const MyComponnt = (props: {
      className?: string;
      style?: React.CSSProperties;
    }) => {
      expect(
        props.style,
        'styles should not be generated for a component',
      ).toBeUndefined();
      expect(props.className).toBe('p-4 text-blue-400');
      return (
        <div
          className={`${props.className} bg-red-500`}
          style={{ ...props.style, padding: '4px' }}
        />
      );
    };

    expect(
      await render(
        <Tailwind>
          <MyComponnt className="p-4 text-blue-400" />
        </Tailwind>,
      ),
    ).toMatchInlineSnapshot(
      `"<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><!--$--><div style="padding:4px;color:rgb(81,162,255);background-color:rgb(251,44,54)"></div><!--/$-->"`,
    );
  });

  it("works properly with 'no-underline'", async () => {
    const actualOutput = await render(
      <Html>
        <body>
          <Tailwind>
            <p className="text-[14px] text-black leading-[24px]">
              or copy and paste this URL into your browser:{' '}
              <Link
                className="other text-blue-600 no-underline"
                href="https://react.email"
              >
                https://react.email
              </Link>
            </p>
            <p className="text-[14px] text-black leading-[24px]">
              or copy and paste this URL into your browser:{' '}
              <Link
                className="text-blue-600 no-underline"
                href="https://react.email"
              >
                https://react.email
              </Link>
            </p>
          </Tailwind>
        </body>
      </Html>,
    );
    expect(actualOutput).toMatchInlineSnapshot(
      `"<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html dir="ltr" lang="en"><head></head><!--$--><body><p style="font-size:14px;color:rgb(0,0,0);line-height:24px">or copy and paste this URL into your browser:<!-- --> <a class="other" href="https://react.email" style="color:rgb(21,93,252);text-decoration-line:none" target="_blank">https://react.email</a></p><p style="font-size:14px;color:rgb(0,0,0);line-height:24px">or copy and paste this URL into your browser:<!-- --> <a href="https://react.email" style="color:rgb(21,93,252);text-decoration-line:none" target="_blank">https://react.email</a></p><!--/$--></body></html>"`,
    );
  });

  it('renders children with inline Tailwind styles', async () => {
    const actualOutput = await render(
      <Tailwind>
        <div className="bg-white" />
      </Tailwind>,
    );

    expect(actualOutput).toMatchInlineSnapshot(
      `"<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><!--$--><div style="background-color:rgb(255,255,255)"></div><!--/$-->"`,
    );
  });

  test('<Button className="px-3 py-2 mt-8 text-sm text-gray-200 bg-blue-600 rounded-md">', async () => {
    const actualOutput = await render(
      <Tailwind>
        <Button className="mt-8 rounded-md bg-blue-600 px-3 py-2 text-gray-200 text-sm">
          Testing button
        </Button>
        Testing
      </Tailwind>,
    );

    expect(actualOutput).toMatchInlineSnapshot(
      `"<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><!--$--><a style="line-height:1.4285714285714286;text-decoration:none;display:inline-block;max-width:100%;mso-padding-alt:0px;margin-top:2rem;border-radius:0.375rem;background-color:rgb(21,93,252);padding-right:12px;padding-left:12px;padding-bottom:8px;padding-top:8px;color:rgb(229,231,235);font-size:0.875rem" target="_blank"><span><!--[if mso]><i style="mso-font-width:300%;mso-text-raise:12" hidden>&#8202;&#8202;</i><![endif]--></span><span style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:6px">Testing button</span><span><!--[if mso]><i style="mso-font-width:300%" hidden>&#8202;&#8202;&#8203;</i><![endif]--></span></a>Testing<!--/$-->"`,
    );
  });

  it('works with custom components with fragment at the root', async () => {
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
          <div className="mt-[100px] text-[50px] leading-[1]">Hello world</div>
          <Brand />
        </Wrapper>
      );
    };

    const actualOutput = await render(EmailTemplate());

    expect(actualOutput).toMatchInlineSnapshot(
      `"<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><!--$--><div style="margin-top:100px;font-size:50px;line-height:1">Hello world</div><div style="padding:20px"><p style="font-weight:700;font-size:50px">React Email</p></div><div style="padding:20px"><p style="font-weight:700;font-size:50px">React Email</p></div><!--/$-->"`,
    );
  });

  it("doesn't generate styles from text", async () => {
    expect(
      await render(<Tailwind>container bg-red-500 bg-blue-300</Tailwind>),
    ).toMatchInlineSnapshot(
      `"<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><!--$-->container bg-red-500 bg-blue-300<!--/$-->"`,
    );
  });

  it('works with components that return children', async () => {
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
          <div className="mt-[100px] text-[50px] leading-[1]">Hello world</div>
          <Brand />
        </Wrapper>
      );
    };

    const actualOutput = await render(EmailTemplate());

    expect(actualOutput).toMatchInlineSnapshot(
      `"<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><!--$--><div style="margin-top:100px;font-size:50px;line-height:1">Hello world</div><div style="padding:20px"><p style="font-weight:700;font-size:50px">React Email</p></div><!--/$-->"`,
    );
  });

  it('works with Heading component', async () => {
    const EmailTemplate = () => {
      return (
        <Tailwind>
          Hello
          <Heading>My testing heading</Heading>
          friends
        </Tailwind>
      );
    };

    expect(await render(<EmailTemplate />)).toMatchInlineSnapshot(
      `"<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><!--$-->Hello<h1>My testing heading</h1>friends<!--/$-->"`,
    );
  });

  it('works with components that use React.forwardRef', async () => {
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
    Brand.displayName = 'Brand';

    const EmailTemplate = () => {
      return (
        <Wrapper>
          <div className="mt-[100px] text-[50px] leading-[1]">Hello world</div>
          <Brand />
        </Wrapper>
      );
    };

    const actualOutput = await render(EmailTemplate());

    expect(actualOutput).toMatchInlineSnapshot(
      `"<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><!--$--><div style="margin-top:100px;font-size:50px;line-height:1">Hello world</div><div style="padding:20px"><p style="font-weight:700;font-size:50px">React Email</p></div><!--/$-->"`,
    );
  });

  it('uses background image', async () => {
    const actualOutput = await render(
      <Tailwind>
        <div className="bg-[url(https://example.com/image.png)]" />
      </Tailwind>,
    );

    expect(actualOutput).toMatchInlineSnapshot(
      `"<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><!--$--><div style="background-image:url(https://example.com/image.png)"></div><!--/$-->"`,
    );
  });

  it('does not override inline styles with Tailwind styles', async () => {
    const actualOutput = await render(
      <Tailwind>
        <div
          className="bg-black text-[16px]"
          style={{ backgroundColor: 'red', fontSize: '12px' }}
        />
      </Tailwind>,
    );

    expect(actualOutput).toMatchInlineSnapshot(
      `"<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><!--$--><div style="background-color:red;font-size:12px"></div><!--/$-->"`,
    );
  });

  it('overrides component styles with Tailwind styles', async () => {
    const actualOutput = await render(
      <Tailwind>
        <Hr className="w-12" />
      </Tailwind>,
    );

    expect(actualOutput).toMatchInlineSnapshot(
      `"<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><!--$--><hr style="width:3rem;border:none;border-top:1px solid #eaeaea"/><!--/$-->"`,
    );
  });

  it('preserves mso styles', async () => {
    const actualOutput = await render(
      <Html>
        <Tailwind>
          <Head />
          <span
            dangerouslySetInnerHTML={{
              __html: `<!--[if mso]><i style="letter-spacing: 10px;mso-font-width:-100%;" hidden>&nbsp;</i><![endif]-->`,
            }}
          />
          <div className="custom-class bg-white sm:bg-red-50 sm:text-sm md:text-lg" />
        </Tailwind>
      </Html>,
    ).then(pretty);

    expect(actualOutput).toMatchInlineSnapshot(`
      "<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html dir="ltr" lang="en">
        <head>
          <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
          <meta name="x-apple-disable-message-reformatting" />
          <!--$-->
          <style>
            .sm_bg-red-50{@media (width>=40rem){background-color:rgb(254,242,242)!important}}.sm_text-sm{@media (width>=40rem){font-size:0.875rem!important;line-height:1.4285714285714286!important}}.md_text-lg{@media (width>=48rem){font-size:1.125rem!important;line-height:1.5555555555555556!important}}
          </style></head
        ><span
          ><!--[if mso]><i style="letter-spacing: 10px;mso-font-width:-100%;" hidden>&nbsp;</i><![endif]--></span
        >
        <div
          class="custom-class sm_bg-red-50 sm_text-sm md_text-lg"
          style="background-color:rgb(255,255,255)"></div>
        <!--/$-->
      </html>
      "
    `);
  });

  // See https://github.com/resend/react-email/issues/2388
  it('properly does not inline custom utilities', async () => {
    const actualOutput = await render(
      <Tailwind
        config={{
          plugins: [
            plugin(({ addUtilities }) => {
              addUtilities({
                '.text-body': {
                  '@apply text-[green] dark:text-[orange]': {},
                },
              });
            }),
          ],
        }}
      >
        <Html>
          <Head />
          <Body className="text-body">this is the body</Body>
        </Html>
      </Tailwind>,
    );

    expect(actualOutput).toMatchInlineSnapshot(
      `"<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html dir="ltr" lang="en"><head><meta content="text/html; charset=UTF-8" http-equiv="Content-Type"/><meta name="x-apple-disable-message-reformatting"/><!--$--><style>.text-body{color:green!important;@media (prefers-color-scheme:dark){color:orange!important}}</style></head><body class="text-body"><table border="0" width="100%" cellPadding="0" cellSpacing="0" role="presentation" align="center"><tbody><tr><td>this is the body</td></tr></tbody></table><!--/$--></body></html>"`,
    );
  });

  it('recognizes custom responsive screen', async () => {
    const actualOutput = await render(
      <Html>
        <Tailwind
          config={{
            theme: {
              screens: {
                sm: { min: '640px' },
                md: { min: '768px' },
                lg: { min: '1024px' },
                xl: { min: '1280px' },
                '2xl': { min: '1536px' },
              },
            },
          }}
        >
          <Head />
          <div className="bg-red-100 xl:bg-green-500">Test</div>
          <div className="2xl:bg-blue-500">Test</div>
        </Tailwind>
      </Html>,
    ).then(pretty);

    expect(actualOutput).toMatchInlineSnapshot(`
      "<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html dir="ltr" lang="en">
        <head>
          <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
          <meta name="x-apple-disable-message-reformatting" />
          <!--$-->
          <style>
            .xl_bg-green-500{@media (width>=1280px){background-color:rgb(0,201,80)!important}}.twoxl_bg-blue-500{@media (width>=1536px){background-color:rgb(43,127,255)!important}}
          </style>
        </head>
        <div class="xl_bg-green-500" style="background-color:rgb(255,226,226)">
          Test
        </div>
        <div class="twoxl_bg-blue-500">Test</div>
        <!--/$-->
      </html>
      "
    `);
  });

  it('works with calc() with + sign', async () => {
    const actualOutput = await render(
      <Tailwind>
        <head />
        <div className="max-h-[calc(50px+3rem)] bg-red-100 lg:max-h-[calc(50px+5rem)]">
          <div className="h-[200px]">something tall</div>
        </div>
      </Tailwind>,
    ).then(pretty);

    expect(actualOutput).toMatchInlineSnapshot(`
      "<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <head>
        <!--$-->
        <style>
          .lg_max-h-calc50pxplus5rem{@media (width>=64rem){max-height:calc(50px + 5rem)!important}}
        </style>
      </head>
      <div
        class="lg_max-h-calc50pxplus5rem"
        style="max-height:calc(50px + 3rem);background-color:rgb(255,226,226)">
        <div style="height:200px">something tall</div>
      </div>
      <!--/$-->
      "
    `);
  });

  describe('with non-inlinable styles', () => {
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
    it('works with arbitrarily deep (in the React tree) <head> elements', async () => {
      expect(
        await render(
          <Tailwind>
            <html lang="en">
              <head />
              <body>
                <div className="bg-red-200 sm:bg-red-300 md:bg-red-400 lg:bg-red-500" />
              </body>
            </html>
          </Tailwind>,
        ).then(pretty),
      ).toMatchInlineSnapshot(`
        "<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html lang="en">
          <head>
            <!--$-->
            <style>
              .sm_bg-red-300{@media (width>=40rem){background-color:rgb(255,162,162)!important}}.md_bg-red-400{@media (width>=48rem){background-color:rgb(255,100,103)!important}}.lg_bg-red-500{@media (width>=64rem){background-color:rgb(251,44,54)!important}}
            </style>
          </head>
          <body>
            <div
              class="sm_bg-red-300 md_bg-red-400 lg_bg-red-500"
              style="background-color:rgb(255,201,201)"></div>
            <!--/$-->
          </body>
        </html>
        "
      `);

      const MyHead = (props: Record<string, any>) => {
        return <head {...props} />;
      };

      expect(
        await render(
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
        `"<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html lang="en"><head><!--$--><style>.sm_bg-red-300{@media (width>=40rem){background-color:rgb(255,162,162)!important}}.md_bg-red-400{@media (width>=48rem){background-color:rgb(255,100,103)!important}}.lg_bg-red-500{@media (width>=64rem){background-color:rgb(251,44,54)!important}}</style></head><body><div class="sm_bg-red-300 md_bg-red-400 lg_bg-red-500" style="background-color:rgb(255,201,201)"></div><!--/$--></body></html>"`,
      );
    });

    it('handles non-inlinable styles in custom utilities', async () => {
      const actualOutput = await render(
        <html lang="en">
          <Tailwind
            config={{
              plugins: [
                {
                  handler: (api) => {
                    api.addUtilities({
                      '.text-body': {
                        '@apply text-[green] sm:text-[darkgreen]': {},
                      },
                    });
                  },
                },
              ],
            }}
          >
            <head />
            <body>
              <div className="text-body" />
            </body>
          </Tailwind>
        </html>,
      ).then(pretty);
      expect(actualOutput).toMatchInlineSnapshot(`
        "<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html lang="en">
          <head>
            <!--$-->
            <style>
              .text-body{color:green!important;@media (width>=40rem){color:darkgreen!important}}
            </style>
          </head>
          <body>
            <div class="text-body"></div>
            <!--/$-->
          </body>
        </html>
        "
      `);
    });

    it('adds css to <head/> and keep class names', async () => {
      const actualOutput = await render(
        <html lang="en">
          <Tailwind>
            <head />
            <body>
              <div className="bg-red-200 hover:bg-red-600 focus:bg-red-700 sm:bg-red-300 sm:hover:bg-red-200 md:bg-red-400 lg:bg-red-500" />
            </body>
          </Tailwind>
        </html>,
      ).then(pretty);

      expect(actualOutput).toMatchInlineSnapshot(`
        "<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html lang="en">
          <head>
            <!--$-->
            <style>
              .hover_bg-red-600{&:hover{@media (hover:hover){background-color:rgb(231,0,11)!important}}}.focus_bg-red-700{&:focus{background-color:rgb(193,0,7)!important}}.sm_bg-red-300{@media (width>=40rem){background-color:rgb(255,162,162)!important}}.sm_hover_bg-red-200{@media (width>=40rem){&:hover{@media (hover:hover){background-color:rgb(255,201,201)!important}}}}.md_bg-red-400{@media (width>=48rem){background-color:rgb(255,100,103)!important}}.lg_bg-red-500{@media (width>=64rem){background-color:rgb(251,44,54)!important}}
            </style>
          </head>
          <body>
            <div
              class="hover_bg-red-600 focus_bg-red-700 sm_bg-red-300 sm_hover_bg-red-200 md_bg-red-400 lg_bg-red-500"
              style="background-color:rgb(255,201,201)"></div>
            <!--/$-->
          </body>
        </html>
        "
      `);
    });

    it('throws error when used without the head and with media query class names very deeply nested', async () => {
      const Component1 = (props: Record<string, any>) => {
        return (
          <div {...props} className="h-30 w-40 sm:h-10 sm:w-10">
            {props.children}
          </div>
        );
      };
      const Component2 = (props: Record<string, any>) => {
        return (
          <div {...props}>
            <Component1>{props.children}</Component1>
          </div>
        );
      };
      const Component3 = (props: Record<string, any>) => {
        return (
          <div {...props}>
            <Component2>{props.children}</Component2>
          </div>
        );
      };

      function renderComplexEmailWithoutHead() {
        return render(
          <Tailwind>
            <div className="bg-red-300">
              <Component3 className="random-classname w-full">
                <div className="w-50">Testing</div>
              </Component3>
            </div>
          </Tailwind>,
        );
      }

      await expect(
        renderComplexEmailWithoutHead,
      ).rejects.toThrowErrorMatchingSnapshot();
    });

    it('works with relatively complex media query utilities', async () => {
      const Email = () => {
        return (
          <Tailwind>
            <Head />
            <p className="text-blue-700 max-sm:text-red-600">I am some text</p>
          </Tailwind>
        );
      };

      expect(await render(<Email />).then(pretty)).toMatchInlineSnapshot(`
        "<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <head>
          <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
          <meta name="x-apple-disable-message-reformatting" />
          <!--$-->
          <style>
            .max-sm_text-red-600{@media (width<40rem){color:rgb(231,0,11)!important}}
          </style>
        </head>
        <p class="max-sm_text-red-600" style="color:rgb(20,71,230)">I am some text</p>
        <!--/$-->
        "
      `);
    });

    it('throws an error when used without a <head/>', async () => {
      function noHead() {
        return render(
          <Tailwind>
            <html lang="en">
              {/* <Head></Head> */}
              <div className="bg-red-200 sm:bg-red-500" />
            </html>
          </Tailwind>,
        ).then(pretty);
      }
      await expect(noHead).rejects.toThrowErrorMatchingSnapshot();
    });

    it('persists existing <head/> elements', async () => {
      const actualOutput = await render(
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
      ).then(pretty);

      expect(actualOutput).toMatchInlineSnapshot(`
        "<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html lang="en">
          <head>
            <!--$-->
            <style>
              .sm_bg-red-500{@media (width>=40rem){background-color:rgb(251,44,54)!important}}
            </style>
            <style></style>
            <link />
          </head>
          <body>
            <div class="sm_bg-red-500" style="background-color:rgb(255,201,201)"></div>
            <!--/$-->
          </body>
        </html>
        "
      `);
    });
  });

  describe('with custom theme config', () => {
    it('supports custom colors', async () => {
      const config: TailwindConfig = {
        theme: {
          extend: {
            colors: {
              custom: '#1fb6ff',
            },
          },
        },
      };

      const actualOutput = await render(
        <Tailwind config={config}>
          <div className="bg-custom text-custom" />
        </Tailwind>,
      ).then(pretty);

      expect(actualOutput).toMatchInlineSnapshot(`
        "<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <!--$-->
        <div style="background-color:rgb(31,182,255);color:rgb(31,182,255)"></div>
        <!--/$-->
        "
      `);
    });

    it('supports custom camelCased colors', async () => {
      const config: TailwindConfig = {
        theme: {
          extend: {
            colors: {
              customColor: '#1fb6ff',
            },
          },
        },
      };

      const actualOutput = await render(
        <Tailwind config={config}>
          <div className="bg-customColor text-customColor" />
        </Tailwind>,
      ).then(pretty);

      expect(actualOutput).toMatchInlineSnapshot(`
        "<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <!--$-->
        <div style="background-color:rgb(31,182,255);color:rgb(31,182,255)"></div>
        <!--/$-->
        "
      `);
    });

    it('supports custom fonts', async () => {
      const config: TailwindConfig = {
        theme: {
          extend: {
            fontFamily: {
              sans: ['Graphik', 'sans-serif'],
              serif: ['Merriweather', 'serif'],
            },
          },
        },
      };

      const actualOutput = await render(
        <Tailwind config={config}>
          <div className="font-sans" />
          <div className="font-serif" />
        </Tailwind>,
      ).then(pretty);

      expect(actualOutput).toMatchInlineSnapshot(`
        "<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <!--$-->
        <div style="font-family:Graphik,sans-serif"></div>
        <div style="font-family:Merriweather,serif"></div>
        <!--/$-->
        "
      `);
    });

    it('supports custom spacing', async () => {
      const config: TailwindConfig = {
        theme: {
          extend: {
            spacing: {
              '8xl': '96rem',
            },
          },
        },
      };
      const actualOutput = await render(
        <Tailwind config={config}>
          <div className="m-8xl" />
        </Tailwind>,
      ).then(pretty);
      expect(actualOutput).toMatchInlineSnapshot(`
        "<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <!--$-->
        <div style="margin:96rem"></div>
        <!--/$-->
        "
      `);
    });

    it('supports custom border radius', async () => {
      const config: TailwindConfig = {
        theme: {
          extend: {
            borderRadius: {
              '4xl': '2rem',
            },
          },
        },
      };
      const actualOutput = await render(
        <Tailwind config={config}>
          <div className="rounded-4xl" />
        </Tailwind>,
      ).then(pretty);
      expect(actualOutput).toMatchInlineSnapshot(`
        "<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <!--$-->
        <div style="border-radius:2rem"></div>
        <!--/$-->
        "
      `);
    });

    it('supports custom text alignment', async () => {
      const config: TailwindConfig = {
        theme: {
          extend: {
            textAlign: {
              justify: 'justify',
            },
          },
        },
      };

      const actualOutput = await render(
        <Tailwind config={config}>
          <div className="text-justify" />
        </Tailwind>,
      ).then(pretty);

      expect(actualOutput).toMatchInlineSnapshot(`
        "<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <!--$-->
        <div style="text-align:justify"></div>
        <!--/$-->
        "
      `);
    });
  });

  describe('with theme', () => {
    it('handles empty theme string', async () => {
      const actualOutput = await render(
        <Tailwind theme="">
          <div className="bg-red-500 text-white">Default utilities</div>
        </Tailwind>,
      ).then(pretty);

      expect(actualOutput).toMatchInlineSnapshot(`
        "<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <!--$-->
        <div style="background-color:rgb(251,44,54);color:rgb(255,255,255)">
          Default utilities
        </div>
        <!--/$-->
        "
      `);
    });

    it('supports custom colors', async () => {
      const theme = `
      @theme {
        --color-custom: #1fb6ff;
      }
      `;

      const actualOutput = await render(
        <Tailwind theme={theme}>
          <div className="bg-custom text-custom" />
        </Tailwind>,
      ).then(pretty);

      expect(actualOutput).toMatchInlineSnapshot(`
        "<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <!--$-->
        <div style="background-color:rgb(31,182,255);color:rgb(31,182,255)"></div>
        <!--/$-->
        "
      `);
    });

    it('supports custom fonts', async () => {
      const theme = `
      @theme {
        --font-sans: "Graphik", sans-serif;
        --font-serif: "Merriweather", serif;
      }
      `;

      const actualOutput = await render(
        <Tailwind theme={theme}>
          <div className="font-sans" />
          <div className="font-serif" />
        </Tailwind>,
      ).then(pretty);

      expect(actualOutput).toMatchInlineSnapshot(`
        "<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <!--$-->
        <div style='font-family:"Graphik",sans-serif'></div>
        <div style='font-family:"Merriweather",serif'></div>
        <!--/$-->
        "
      `);
    });

    it('supports custom spacing', async () => {
      const theme = `
        @theme {
          --spacing-8xl: 96rem;
        }
      `;

      const actualOutput = await render(
        <Tailwind theme={theme}>
          <div className="m-8xl" />
        </Tailwind>,
      ).then(pretty);
      expect(actualOutput).toMatchInlineSnapshot(`
        "<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <!--$-->
        <div style="margin:96rem"></div>
        <!--/$-->
        "
      `);
    });

    it('supports custom border radius', async () => {
      const theme = `
        @theme {
          --border-radius-4xl: 2rem;
        }
      `;

      const actualOutput = await render(
        <Tailwind theme={theme}>
          <div className="rounded-4xl" />
        </Tailwind>,
      ).then(pretty);
      expect(actualOutput).toMatchInlineSnapshot(`
        "<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <!--$-->
        <div style="border-radius:2rem"></div>
        <!--/$-->
        "
      `);
    });

    it('supports custom text alignment', async () => {
      const theme = `
        @theme {
          --text-align-justify: justify;
        }
      `;

      const actualOutput = await render(
        <Tailwind theme={theme}>
          <div className="text-justify" />
        </Tailwind>,
      ).then(pretty);

      expect(actualOutput).toMatchInlineSnapshot(`
        "<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <!--$-->
        <div style="text-align:justify"></div>
        <!--/$-->
        "
      `);
    });

    it('supports both config and theme props together', async () => {
      const customConfig = {
        theme: {
          extend: {
            colors: {
              primary: '#ff0000',
            },
          },
        },
      } satisfies TailwindConfig;

      const customTheme = `
        @theme {
          --color-secondary: #00ff00;
        }
      `;

      const actualOutput = await render(
        <Tailwind config={customConfig} theme={customTheme}>
          <div className="bg-primary text-secondary">Both config and theme</div>
        </Tailwind>,
      ).then(pretty);

      expect(actualOutput).toMatchInlineSnapshot(`
        "<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <!--$-->
        <div style="background-color:rgb(255,0,0);color:rgb(0,255,0)">
          Both config and theme
        </div>
        <!--/$-->
        "
      `);
    });
  });

  describe('with utilities', () => {
    it('handles empty utilities string', async () => {
      const actualOutput = await render(
        <Tailwind utility="">
          <div className="bg-red-500 text-white">Default utilities</div>
        </Tailwind>,
      ).then(pretty);

      expect(actualOutput).toMatchInlineSnapshot(`
        "<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <!--$-->
        <div style="background-color:rgb(251,44,54);color:rgb(255,255,255)">
          Default utilities
        </div>
        <!--/$-->
        "
      `);
    });

    it('supports custom utilities', async () => {
      const utilities = `
      .custom-shadow {
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        padding: 16px;
      }
      `;

      const actualOutput = await render(
        <Tailwind utility={utilities}>
          <div className="custom-shadow" />
        </Tailwind>,
      ).then(pretty);

      expect(actualOutput).toMatchInlineSnapshot(`
        "<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <!--$-->
        <div
          style="box-shadow:0 4px 6px rgba(0,0,0,0.1);border-radius:8px;padding:16px"></div>
        <!--/$-->
        "
      `);
    });

    it('supports animations', async () => {
      const utilities = `
        .pulse-animation {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `;

      const actualOutput = await render(
        <Tailwind utility={utilities}>
          <div className="pulse-animation" />
        </Tailwind>,
      ).then(pretty);

      expect(actualOutput).toMatchInlineSnapshot(`
        "<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <!--$-->
        <div style="animation:pulse 2s cubic-bezier(0.4,0,0.6,1) infinite"></div>
        <!--/$-->
        "
      `);
    });

    it('supports both config and utilities props together', async () => {
      const customConfig = {
        theme: {
          extend: {
            colors: {
              primary: '#ff0000',
            },
          },
        },
      } satisfies TailwindConfig;

      const customUtilities = `
        .card-base {
          border: 1px solid #e5e7eb;
          padding: 20px;
        }
      `;

      const actualOutput = await render(
        <Tailwind config={customConfig} utility={customUtilities}>
          <div className="bg-primary card-base">Config and utilities</div>
        </Tailwind>,
      ).then(pretty);

      expect(actualOutput).toMatchInlineSnapshot(`
        "<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <!--$-->
        <div
          style="background-color:rgb(255,0,0);border:1px solid rgb(229,231,235);padding:20px">
          Config and utilities
        </div>
        <!--/$-->
        "
      `);
    });

    it('supports config, theme, and utilities together', async () => {
      const customConfig = {
        theme: {
          extend: {
            colors: {
              primary: '#ff0000',
            },
          },
        },
      } satisfies TailwindConfig;

      const customTheme = `
        @theme {
          --color-secondary: #00ff00;
        }
      `;

      const customUtilities = `
        .special-border {
          border: 2px dashed #0000ff;
        }
      `;

      const actualOutput = await render(
        <Tailwind config={customConfig} theme={customTheme} utility={customUtilities}>
          <div className="bg-primary text-secondary special-border">All three props</div>
        </Tailwind>,
      ).then(pretty);

      expect(actualOutput).toMatchInlineSnapshot(`
        "<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <!--$-->
        <div
          style="background-color:rgb(255,0,0);color:rgb(0,255,0);border:2px dashed rgb(0,0,255)">
          All three props
        </div>
        <!--/$-->
        "
      `);
    });
  });

  describe('with custom plugins config', () => {
    const config = {
      plugins: [
        {
          handler: (api) => {
            api.addUtilities({
              '.border-custom': {
                border: '2px solid',
              },
            });
          },
        },
      ],
    } satisfies TailwindConfig;

    it('supports custom plugins', async () => {
      const actualOutput = await render(
        <Tailwind config={config}>
          <div className="border-custom" />
        </Tailwind>,
      ).then(pretty);

      expect(actualOutput).toMatchInlineSnapshot(`
        "<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <!--$-->
        <div style="border:2px solid"></div>
        <!--/$-->
        "
      `);
    });

    it('supports custom plugins with responsive styles', async () => {
      const actualOutput = await render(
        <html lang="en">
          <Tailwind config={config}>
            <head />
            <body>
              <div className="border-custom sm:border-custom" />
            </body>
          </Tailwind>
        </html>,
      ).then(pretty);

      expect(actualOutput).toMatchInlineSnapshot(`
        "<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html lang="en">
          <head>
            <!--$-->
            <style>
              .sm_border-custom{@media (width>=40rem){border:2px solid!important}}
            </style>
          </head>
          <body>
            <div class="sm_border-custom" style="border:2px solid"></div>
            <!--/$-->
          </body>
        </html>
        "
      `);
    });
  });
});
