import { Suspense } from "react";
import usePromise from "react-promise-suspense";
import { render } from "./custom-render";

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

  it.only("works with Suspense", async () => {
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
});
