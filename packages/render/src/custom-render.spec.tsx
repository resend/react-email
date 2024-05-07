import { render } from "./custom-render";

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

test("render", async () => {
  const html = await render(<EmailComponent username="Banana man" />);

  console.log(html);

  expect(html).toMatchSnapshot();
});
