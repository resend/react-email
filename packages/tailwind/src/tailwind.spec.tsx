import { Button } from '@react-email/button';
import { Head } from '@react-email/head';
import { Heading } from '@react-email/heading';
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Hr } from '@react-email/hr';
import { Html } from '@react-email/html';
import { Link } from '@react-email/link';
import { render } from '@react-email/render';
import { ResponsiveColumn, ResponsiveRow } from '@responsive-email/react-email';
import React from 'react';
import { Tailwind } from '.';
import type { TailwindConfig } from '.';

describe('Tailwind component', () => {
  it('should allow for complex children manipulation', async () => {
    const actualOutput = await render(
      <Tailwind>
        <ResponsiveRow>
          <ResponsiveColumn>This is the first column</ResponsiveColumn>
          <ResponsiveColumn>This is the second column</ResponsiveColumn>
        </ResponsiveRow>
      </Tailwind>,
    );
    expect(actualOutput).toMatchSnapshot();
  });

  it('should work with class manipulation done on components', async () => {
    const MyComponnt = (props: {
      className?: string;
      style?: React.CSSProperties;
    }) => {
      expect(
        props.style,
        'Styles should be generated the same for a component',
      ).toEqual({
        color: 'rgb(96,165,250)',
        padding: '1rem',
      });
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
          <MyComponnt className="text-blue-400 p-4" />
        </Tailwind>,
      ),
    ).toMatchSnapshot();
  });

  it("should work properly with 'no-underline'", async () => {
    const actualOutput = await render(
      <Html>
        <body>
          <Tailwind>
            <p className="text-black text-[14px] leading-[24px]">
              or copy and paste this URL into your browser:{' '}
              <Link
                className="text-blue-600 no-underline other"
                href="https://react.email"
              >
                https://react.email
              </Link>
            </p>
            <p className="text-black text-[14px] leading-[24px]">
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
    expect(actualOutput).toMatchSnapshot();
  });

  describe('Inline styles', () => {
    it('should render children with inline Tailwind styles', async () => {
      const actualOutput = await render(
        <Tailwind>
          <div className="bg-white" />
        </Tailwind>,
      );

      expect(actualOutput).not.toBeNull();
    });
  });

  // test("with React context and custom components", () => {
  //   const SharedDataContext = React.createContext<{ name: string } | undefined>(undefined);
  //
  //   const IsGreat = () => {
  //     // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  //     const sharedData = React.useContext(SharedDataContext)!;
  //
  //     expect(sharedData).toBeDefined();
  //
  //     return <p className="text-red-500 sm:text-blue-300">
  //       {sharedData.name} is great!
  //     </p>;
  //   };
  //
  //   render(
  //     <Html>
  //       <Tailwind>
  //         <Head/>
  //         <SharedDataContext.Provider value={{ name: 'React Email' }}>
  //           <body className="bg-slate-900 text-gray-200">
  //             <IsGreat/>
  //           </body>
  //         </SharedDataContext.Provider>
  //       </Tailwind>
  //     </Html>
  //   );
  // });

  test('<Button className="px-3 py-2 mt-8 text-sm text-gray-200 bg-blue-600 rounded-md">', async () => {
    const actualOutput = await render(
      <Tailwind>
        <Button className="px-3 py-2 mt-8 text-sm text-gray-200 bg-blue-600 rounded-md">
          Testing button
        </Button>
        Testing
      </Tailwind>,
    );

    expect(actualOutput).toMatchSnapshot();
  });

  it('should work with custom components with fragment at the root', async () => {
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

    const actualOutput = await render(EmailTemplate());

    expect(actualOutput).toMatchSnapshot();
  });

  test('it should not generate styles from text', async () => {
    expect(
      await render(<Tailwind>container bg-red-500 bg-blue-300</Tailwind>),
    ).toMatchSnapshot();
  });

  it('should work with components that return children', async () => {
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

    const actualOutput = await render(EmailTemplate());

    expect(actualOutput).toMatchSnapshot();
  });

  it('should work with Heading component', async () => {
    const EmailTemplate = () => {
      return (
        <Tailwind>
          Hello
          <Heading>My testing heading</Heading>
          friends
        </Tailwind>
      );
    };

    expect(await render(<EmailTemplate />)).toMatchSnapshot();
  });

  it('should work with components that use React.forwardRef', async () => {
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
          <div className="text-[50px] leading-[1] mt-[100px]">Hello world</div>
          <Brand />
        </Wrapper>
      );
    };

    const actualOutput = await render(EmailTemplate());

    expect(actualOutput).toMatchSnapshot();
  });

  it('should be able to use background image', async () => {
    const actualOutput = await render(
      <Tailwind>
        <div className="bg-[url(https://example.com/image.png)]" />
      </Tailwind>,
    );

    expect(actualOutput).toMatchSnapshot();
  });

  it('should not override inline styles with Tailwind styles', async () => {
    const actualOutput = await render(
      <Tailwind>
        <div
          className="bg-black text-[16px]"
          style={{ backgroundColor: 'red', fontSize: '12px' }}
        />
      </Tailwind>,
    );

    expect(actualOutput).toMatchSnapshot();
  });

  it('should override component styles with Tailwind styles', async () => {
    const actualOutput = await render(
      <Tailwind>
        <Hr className="w-12" />
      </Tailwind>,
    );

    expect(actualOutput).toContain('width:3rem');
  });

  it('should preserve mso styles', async () => {
    const actualOutput = await render(
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

    expect(actualOutput).toMatchSnapshot();
  });

  it('should recognize custom responsive screen', async () => {
    const config: TailwindConfig = {
      theme: {
        screens: {
          sm: { min: '640px' },
          md: { min: '768px' },
          lg: { min: '1024px' },
          xl: { min: '1280px' },
          '2xl': { min: '1536px' },
        },
      },
    };
    const actualOutput = await render(
      <Html>
        <Tailwind config={config}>
          <Head />
          <div className="bg-red-100 xl:bg-green-500">Test</div>
          <div className="2xl:bg-blue-500">Test</div>
        </Tailwind>
      </Html>,
    );

    expect(actualOutput).toMatchSnapshot();
  });

  it('should work with calc() with + sign', async () => {
    const actualOutput = await render(
      <Tailwind>
        <head />
        <div className="max-h-[calc(50px+3rem)] lg:max-h-[calc(50px+5rem)] bg-red-100">
          <div className="h-[200px]">something tall</div>
        </div>
      </Tailwind>,
    );

    expect(actualOutput).toMatchSnapshot();
  });
});

describe('Responsive styles', () => {
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
  it('should work with arbitrarily deep (in the React tree) <head> elements', async () => {
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
      ),
    ).toMatchSnapshot();

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
    ).toMatchSnapshot();
  });

  it('should not have duplicate media queries', async () => {
    const Body = (props: { className: string; children: React.ReactNode }) => {
      return <body className={props.className}>{props.children}</body>;
    };
    const output = await render(
      <Tailwind>
        <Head />
        <Body className="bg-white my-auto mx-auto font-sans md:px-[64px]">
          <div className="md:px-[64px]" />
        </Body>
      </Tailwind>,
    );

    expect(output).toMatchSnapshot();
  });

  it('should add css to <head/> and keep responsive class names', async () => {
    const actualOutput = await render(
      <html lang="en">
        <Tailwind>
          <head />
          <body>
            <div className="bg-red-200 sm:bg-red-300 md:bg-red-400 lg:bg-red-500" />
          </body>
        </Tailwind>
      </html>,
    );

    expect(actualOutput).toMatchSnapshot();
  });

  it('should throw error when used without the head and with media query class names only very deeply nested', async () => {
    const Component1 = (props: Record<string, any>) => {
      return (
        <div {...props} className="w-40 h-30 sm:h-10 sm:w-10">
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

  it('should work with relatively complex media query utilities', async () => {
    const Email = () => {
      return (
        <Tailwind>
          <Head />
          <p className="text-blue-700 max-sm:text-red-600">I am some text</p>
        </Tailwind>
      );
    };

    expect(await render(<Email />)).toMatchSnapshot();
  });

  it('should throw an error when used without a <head/>', async () => {
    function noHead() {
      return render(
        <Tailwind>
          <html lang="en">
            {/* <Head></Head> */}
            <div className="bg-red-200 sm:bg-red-500" />
          </html>
        </Tailwind>,
      );
    }
    await expect(noHead).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should persist existing <head/> elements', async () => {
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
    );

    expect(actualOutput).toMatchSnapshot();
  });
});

describe('Custom theme config', () => {
  it('should be able to use custom colors', async () => {
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
        <div className="text-custom bg-custom" />
      </Tailwind>,
    );

    expect(actualOutput).toMatchSnapshot();
  });

  it('should be able to use custom fonts', async () => {
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
    );

    expect(actualOutput).toMatchSnapshot();
  });

  it('should be able to use custom spacing', async () => {
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
    );
    expect(actualOutput).toMatchSnapshot();
  });

  it('should be able to use custom border radius', async () => {
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
    );
    expect(actualOutput).toMatchSnapshot();
  });

  it('should be able to use custom text alignment', async () => {
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
    );

    expect(actualOutput).toMatchSnapshot();
  });
});

describe('Custom plugins config', () => {
  it('should be able to use custom plugins', async () => {
    const config: TailwindConfig = {
      plugins: [
        ({ addUtilities }: any) => {
          const newUtilities = {
            '.border-custom': {
              border: '2px solid',
            },
          };

          addUtilities(newUtilities);
        },
      ],
    };

    const actualOutput = await render(
      <Tailwind config={config}>
        <div className="border-custom" />
      </Tailwind>,
    );

    expect(actualOutput).toMatchSnapshot();
  });

  it('should be able to use custom plugins with responsive styles', async () => {
    const config: TailwindConfig = {
      plugins: [
        ({ addUtilities }: any) => {
          const newUtilities = {
            '.border-custom': {
              border: '2px solid',
            },
          };

          addUtilities(newUtilities);
        },
      ],
    };

    const actualOutput = await render(
      <html lang="en">
        <Tailwind config={config}>
          <head />
          <body>
            <div className="border-custom sm:border-custom" />
          </body>
        </Tailwind>
      </html>,
    );

    expect(actualOutput).toMatchSnapshot();
  });
});
