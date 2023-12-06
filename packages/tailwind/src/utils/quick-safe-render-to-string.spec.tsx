import { quickSafeRenderToString } from "./quick-safe-render-to-string";

const stylesFromAVariable = {
  marginInline: "auto",
  width: "100%",
  maxWidth: "768px",
} as React.CSSProperties;

test("quick safe render to string", () => {
  const Component = (props: { name: string }) => {
    return <div className="user-name flex text-2xl">{props.name}</div>;
  };

  const otherJsx = (
    <span className="dark:bg-green-500 hover:bg-green-800 transition-colors">
      More content that comes from another jsx that should be render properly
    </span>
  );

  const jsx = (
    <>
      <div className="bg-red-500 text-gray-200" style={stylesFromAVariable}>
        Content in here that is interesting
        <h1>
          <Component name="Gabriel" />
        </h1>
        {otherJsx}
      </div>
      {otherJsx}
    </>
  );

  expect(quickSafeRenderToString(jsx)).toMatchInlineSnapshot(
    `"<div className=\\"bg-red-500 text-gray-200\\" style=\\"{\\"marginInline\\":\\"auto\\",\\"width\\":\\"100%\\",\\"maxWidth\\":\\"768px\\"}\\">Content in here that is interesting<h1><div className=\\"user-name flex text-2xl\\">Gabriel</div></h1><span className=\\"dark:bg-green-500 hover:bg-green-800 transition-colors\\">More content that comes from another jsx that should be render properly</span></div><span className=\\"dark:bg-green-500 hover:bg-green-800 transition-colors\\">More content that comes from another jsx that should be render properly</span>"`,
  );
});
