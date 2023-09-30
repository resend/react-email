import type { Margin } from ".";
import { withMargin, withSpace } from ".";

describe("withMargin", () => {
  it("should return an empty object for empty input", () => {
    const marginProps: Margin = {};
    const result = withMargin(marginProps);
    expect(result).toEqual({});
  });

  it("should apply margin to the top", () => {
    const marginProps: Margin = { mt: "10" };
    const result = withMargin(marginProps);
    expect(result).toEqual({ marginTop: "10px" });
  });

  it("should apply margin to the left and right", () => {
    const marginProps: Margin = { mx: "20" };
    const result = withMargin(marginProps);
    expect(result).toEqual({ marginLeft: "20px", marginRight: "20px" });
  });

  it("should apply margin to the top and bottom", () => {
    const marginProps: Margin = { my: "15" };
    const result = withMargin(marginProps);
    expect(result).toEqual({
      marginBottom: "15px",
      marginTop: "15px",
    });
  });

  it("should apply margin to all sides", () => {
    const marginProps: Margin = { m: "25" };
    const result = withMargin(marginProps);
    expect(result).toEqual({
      margin: "25px",
    });
  });

  it("should apply margin to specified sides when provided", () => {
    const marginProps: Margin = { mt: "5", mr: "10", mb: "15", ml: "20" };
    const result = withMargin(marginProps);
    expect(result).toEqual({
      marginBottom: "15px",
      marginLeft: "20px",
      marginRight: "10px",
      marginTop: "5px",
    });
  });

  it("should ignore invalid margin values", () => {
    const marginProps: Margin = { m: "invalid", mt: "5", mx: "valid" };
    const result = withMargin(marginProps);
    expect(result).toEqual({
      marginTop: "5px",
    });
  });
});

describe("withSpace", () => {
  it("should return an empty object for undefined value", () => {
    const result = withSpace(undefined, ["margin"]);
    expect(result).toEqual({});
  });

  it("should apply space to the specified properties", () => {
    const result = withSpace(15, ["marginTop", "marginLeft"]);
    expect(result).toEqual({ marginTop: "15px", marginLeft: "15px" });
  });
});
