import { getElementNamesForSupportEntry } from "./get-element-names-for-support-entry";

test("getElementNamesForSupportEntry()", () => {
  expect(getElementNamesForSupportEntry("<bdi> element", null)).toEqual([
    "bdi",
  ]);
  expect(getElementNamesForSupportEntry("address", "address")).toEqual([
    "address",
  ]);
  expect(
    getElementNamesForSupportEntry(
      "<ul>, <ol> and <li>",
      "ul, ol, li, dl, dt, dd",
    ),
  ).toEqual(["ul", "ol", "li", "dl", "dt", "dd"]);
  expect(
    getElementNamesForSupportEntry(
      "HTML5 semantics",
      "article, aside, details, figcaption, figure, footer, header, main, mark, nav, section, summary, time",
    ),
  ).toEqual([
    "article",
    "aside",
    "details",
    "figcaption",
    "figure",
    "footer",
    "header",
    "main",
    "mark",
    "nav",
    "section",
    "summary",
    "time",
  ]);

  expect(getElementNamesForSupportEntry("<video> element", "mp4")).toEqual([
    "video",
  ]);
});
