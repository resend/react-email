import { cssToJsxStyle } from "./css-to-jsx-style";

test("transforms a rule", () => {
  expect(cssToJsxStyle("color: red")).toEqual({ color: "red" });
});

test("transforms multiple rules", () => {
  expect(cssToJsxStyle("color: red; font-size: 2em; opacity: 1;")).toEqual({
    color: "red",
    fontSize: "2em",
    opacity: "1",
  });
});

test("transforms no rules", () => {
  expect(cssToJsxStyle("")).toEqual({});
  expect(cssToJsxStyle("   ")).toEqual({});
  expect(cssToJsxStyle(" : ;; :;: ;")).toEqual({});
});

test("transforms rules with browser prefixes", () => {
  expect(
    cssToJsxStyle("-webkit-transform: scale(2); -ms-transform: scale(2);"),
  ).toEqual({
    msTransform: "scale(2)",
    WebkitTransform: "scale(2)",
  });
});

test("transforms float rule property to cssFloat", () => {
  expect(cssToJsxStyle("float: left")).toEqual({ cssFloat: "left" });
});

test("transforms rules with urls", () => {
  expect(
    cssToJsxStyle(
      'background: red url("awesome/image.png") no-repeat; color: red',
    ),
  ).toEqual({
    background: 'red url("awesome/image.png") no-repeat',
    color: "red",
  });
});

test("transforms rules with dataurls", () => {
  expect(
    cssToJsxStyle("cursor: url(data:image/gif;base64,data); color: red"),
  ).toEqual({
    color: "red",
    cursor: "url(data:image/gif;base64,data)",
  });
});

test("transforms rules with quoted ';' in value", () => {
  expect(
    cssToJsxStyle("list-style-type: ';'; list-style-position: outside;"),
  ).toEqual({
    listStylePosition: "outside",
    listStyleType: "';'",
  });
  expect(
    cssToJsxStyle('list-style-type: ":"; list-style-position: outside;'),
  ).toEqual({
    listStylePosition: "outside",
    listStyleType: '":"',
  });
});

test("transforms rules with quoted ':' in value", () => {
  expect(
    cssToJsxStyle('list-style-type: ";"; list-style-position: inside;'),
  ).toEqual({
    listStylePosition: "inside",
    listStyleType: '";"',
  });
  expect(
    cssToJsxStyle('list-style-type: ":"; list-style-position: inside;'),
  ).toEqual({
    listStylePosition: "inside",
    listStyleType: '":"',
  });
});

test("transforms rule properties of any case to camelCase", () => {
  expect(
    cssToJsxStyle("FONT-SIZE: 2em; font-WEIGHT: bold; oPaCiTy: 1;"),
  ).toEqual({
    fontSize: "2em",
    fontWeight: "bold",
    opacity: "1",
  });
});

test("transforms custom properties", () => {
  expect(cssToJsxStyle("--foo: red; --bar: 2em; opacity: 1")).toEqual({
    "--bar": "2em",
    "--foo": "red",
    opacity: "1",
  });
});

test("ignores empty rules", () => {
  expect(cssToJsxStyle("color: ; font-size: 2em; : 1; ;; ")).toEqual({
    fontSize: "2em",
  });
});

test("handles excessive whitespace", () => {
  expect(
    cssToJsxStyle("color:\nred; \n\r\t\tfont-size:\r2em;\topacity:  1 ;"),
  ).toEqual({
    color: "red",
    fontSize: "2em",
    opacity: "1",
  });
});

test("handles no whitespace", () => {
  expect(cssToJsxStyle("color:red;font-size:2em;opacity:1")).toEqual({
    color: "red",
    fontSize: "2em",
    opacity: "1",
  });
});
