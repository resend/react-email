import { getPropertyTitlesFromSupportEntry } from "./get-property-titles-from-support-entry";

test("getPropertyTitlesFromSupportEntry()", () => {
  // each entry here is for one type of title that caniemail uses
  //
  // very nice if anyone finds an failing entry, to add it here
  const propertiesPerTitleAndKeywords: {
    title: string;
    keywords: string | null;
    properties: string[];
  }[] = [
    {
      title: "accent-color",
      keywords: "accent,color",
      properties: ["accent-color"],
    },
    {
      title: "block-size & inline-size",
      keywords: "block-size, inline-size",
      properties: ["block-size", "inline-size"],
    },
    { title: "height property", keywords: null, properties: ["height"] },
    {
      title: "gap, column-gap, row-gap",
      keywords: "gap",
      properties: ["gap", "column-gap", "row-gap"],
    },
    {
      title: "grid-template-* properties",
      keywords:
        "grid-template, grid-template-areas, grid-template-columns, grid-template-rows",
      properties: [
        "grid-template",
        "grid-template-areas",
        "grid-template-columns",
        "grid-template-rows",
      ],
    },
    {
      title: "clamp()",
      keywords: null,
      properties: [],
    },
  ];

  for (const entryPerPropertyName of propertiesPerTitleAndKeywords) {
    expect(
      getPropertyTitlesFromSupportEntry(
        entryPerPropertyName.title,
        entryPerPropertyName.keywords,
      ),
    ).toEqual(entryPerPropertyName.properties);
  }
});
