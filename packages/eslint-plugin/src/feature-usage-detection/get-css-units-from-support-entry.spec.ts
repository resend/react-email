import { getCssUnitsFromSupportEntry } from "./get-css-units-from-support-entry";

test("getCssUnitsFromSupportEntry", () => {
  expect(getCssUnitsFromSupportEntry("em unit")).toBe("em");
  expect(getCssUnitsFromSupportEntry(":hover")).toBeUndefined();
});
