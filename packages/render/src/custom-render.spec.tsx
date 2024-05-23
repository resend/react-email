import { Suspense } from "react";
import usePromise from "react-promise-suspense";
import { render } from "./custom-render";
import { renderAsync } from "./render-async";
import { VercelInviteUserEmail } from "./utils/vercel-template";

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

  test("with a demo email template vs react-dom's SSR", async () => {
    const template = <VercelInviteUserEmail />;
    const html = await render(template, { pretty: false });
    const htmlFromReactDom = await renderAsync(template, { pretty: false });
    expect(html).toBe(
      htmlFromReactDom
        .replaceAll(/<!--.*?-->/g, (match) =>
          match.startsWith("<!--[if mso]>") ? match : "",
        )
        .replaceAll("&#x27;", "'")
        .replaceAll("&quot;", '"'),
    );
  });
});

