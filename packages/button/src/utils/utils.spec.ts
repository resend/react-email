import { convertToPx, parsePadding, pxToPt } from ".";

describe("convertToPx", () => {
  it('converts "10px" to 10', () => {
    const result = convertToPx("10px");
    expect(result).toBe(10);
  });

  it('converts "2em" to 32', () => {
    const result = convertToPx("2em");
    expect(result).toBe(32);
  });

  it('converts "1.5rem" to 24', () => {
    const result = convertToPx("1.5rem");
    expect(result).toBe(24);
  });

  it('converts "50%" to 300', () => {
    const result = convertToPx("50%");
    expect(result).toBe(300);
  });

  it('converts "15cm" to 0 (unsupported unit)', () => {
    const result = convertToPx("15cm");
    expect(result).toBe(0);
  });

  it('converts "invalid-format" to 0 (invalid input)', () => {
    const result = convertToPx("invalid-format");
    expect(result).toBe(0);
  });

  it("converts empty input to 0", () => {
    const result = convertToPx("");
    expect(result).toBe(0);
  });
});

describe("parsePadding", () => {
  it("parses number input as all paddings", () => {
    const result = parsePadding({ padding: 10 });
    expect(result).toEqual({ pt: 10, pr: 10, pb: 10, pl: 10 });
  });

  it('parses "10px" as all paddings', () => {
    const result = parsePadding({ padding: "10px" });
    expect(result).toEqual({ pt: 10, pr: 10, pb: 10, pl: 10 });
  });

  it('parses "10px 20px" as pt, pr, pl, pb', () => {
    const result = parsePadding({ padding: "10px 2em" });
    expect(result).toEqual({ pt: 10, pr: 32, pb: 10, pl: 32 });
  });

  it('parses "10px 20px 30px" as pt, pr, pb, pl', () => {
    const result = parsePadding({ padding: "10px 20px 30px" });
    expect(result).toEqual({ pt: 10, pr: 20, pb: 30, pl: 20 });
  });

  it('parses "10px 20px 30px 40px" as pt, pr, pb, pl', () => {
    const result = parsePadding({ padding: "10px 20px 30px 40px" });
    expect(result).toEqual({ pt: 10, pr: 20, pb: 30, pl: 40 });
  });

  it("handles undefined input as zeros", () => {
    const result = parsePadding({ padding: undefined });
    expect(result).toEqual({ pt: 0, pr: 0, pb: 0, pl: 0 });
  });

  it("handles empty string input as zeros", () => {
    const result = parsePadding({ padding: "" });
    expect(result).toEqual({ pt: 0, pr: 0, pb: 0, pl: 0 });
  });

  it("overrides general padding value with specific padding value if specified", () => {
    const result = parsePadding({ padding: 10, paddingRight: "1em" });
    expect(result).toEqual({ pt: 10, pr: 16, pb: 10, pl: 10 });
  });
});

describe("pxToPt", () => {
  it('converts "10px" to 7.5', () => {
    const result = pxToPt(10);
    expect(result).toBe(7.5);
  });

  it('converts "20px" to 15', () => {
    const result = pxToPt(20);
    expect(result).toBe(15);
  });

  it('converts "0px" to 0', () => {
    const result = pxToPt(0);
    expect(result).toBe(0);
  });

  it('returns null for invalid input "invalid"', () => {
    const result = pxToPt("invalid" as unknown as number);
    expect(result).toBeNull();
  });

  it("returns null for empty input", () => {
    const result = pxToPt("" as unknown as number);
    expect(result).toBeNull();
  });

  it("returns null for undefined input", () => {
    const result = pxToPt(undefined as unknown as number);
    expect(result).toBeNull();
  });
});
