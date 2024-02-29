import { getCssFunctionsFromSupportEntry } from "./get-css-functions-from-support-entry";

test("getCssFunctionsFromSupportEntry()", () => {
  expect(
    getCssFunctionsFromSupportEntry("lch(), oklch(), lab(), oklab()"),
  ).toEqual(["lch", "oklch", "lab", "oklab"]);

  expect(getCssFunctionsFromSupportEntry("clamp()")).toEqual(["clamp"]);

  expect(getCssFunctionsFromSupportEntry("CSS calc() function")).toEqual([
    "calc",
  ]);
});
