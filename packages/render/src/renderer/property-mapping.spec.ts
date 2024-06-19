import { convertStyleIntoAttribute } from "./property-mapping";

describe("convertStyleIntoAttribute()", () => {
  it("should substitute double quotes with single quotes inside of style attributes", () => {
    expect(
      convertStyleIntoAttribute({
        fontFamily:
          '"Google Sans",Roboto,RobotoDraft,Helvetica,Arial,sans-serif',
        backgroundColor: "#505050",
        margin: "0",
      }),
    ).toBe(
      `style="font-family:'Google Sans',Roboto,RobotoDraft,Helvetica,Arial,sans-serif;background-color:#505050;margin:0"`,
    );
  });

  it("should not add `px` to unitless properties", () => {
    expect(
      convertStyleIntoAttribute({
        lineHeight: 1.25,
      }),
    ).toBe('style="line-height:1.25"');
  });
});
