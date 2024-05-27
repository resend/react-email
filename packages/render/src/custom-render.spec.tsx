import { Suspense } from "react";
import usePromise from "react-promise-suspense";
import { doctype, render } from "./custom-render";

describe("render()", () => {
  it("works with `style` and a `className`", async () => {
    const EmailComponent = (props: { username: string }) => {
      return (
        <div
          className="this-is-my-class-name"
          style={{ transitionTimingFunction: "ease" }}
        >
          Hello, {props.username}
        </div>
      );
    };
    const html = await render(<EmailComponent username="banana man" />);

    expect(html).toMatchSnapshot();
  });

  it("works with Suspense", async () => {
    const wait = () => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 500);
      });
    };

    const EmailComponent = (props: { username: string }) => {
      const username = usePromise(
        async (value) => {
          await wait();
          return value;
        },
        [props.username],
      );

      return (
        <div
          className="this-is-my-class-name"
          style={{ transitionTimingFunction: "ease" }}
        >
          Hello, {username}
        </div>
      );
    };

    const html = await render(
      <div>
        <Suspense>
          <EmailComponent username="banana woman" />
        </Suspense>
      </div>,
    );

    expect(html).toMatchSnapshot();
  });

  it.only("should not modify double curlybraces", async () => {
    const element = <>{'{{my_variable}}'}</>;
    const html = await render(
      element
    );
    expect(html).toBe(`${doctype}{{my_variable}}`);
  });

  it.only("should keep HTML entities", async () => {
    // HTML entities are decoded, without any option for configuration, in JSX transforms.
    // This means that if the HTML entities are used without JSX templating, they would become
    // the ASCII equivalent. In this case, the HEX 0x00A0. 
    //
    // It would certainly be better if this was not the case for us, since users will generally 
    // just directly try adding the HTML entities which will always misbehave for them.
    //
    // In the future, we might incoporate our own preprocessor that avoids this, and would also make
    // it easier to teach users new to React. 
    const element = <>dsadq{'&nbsp;'}dadqw</>;
    const html = await render(
      element
    );

    expect(html).toBe(`${doctype}&nbsp;`);
  });
});

