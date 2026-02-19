/**
 * Tests for changelog sync script (sync-changelog-to-docs.mjs).
 * Run from repo root: pnpm test:scripts
 */

import { describe, it, expect, vi } from "vitest";
import {
  displayName,
  parseChangelog,
  getTagDate,
  getTagForPackage,
  alreadyInDocs,
  entryOrder,
  cleanBullets,
  toMdxBlock,
  toMdxSection,
  dateHeaderToKey,
} from "./sync-changelog-to-docs.mjs";

describe("displayName", () => {
  it("returns known display names for packages with hyphens", () => {
    expect(displayName("react-email")).toBe("React Email");
    expect(displayName("preview-server")).toBe("Preview Server");
    expect(displayName("code-block")).toBe("Code Block");
    expect(displayName("create-email")).toBe("Create Email");
    expect(displayName("body")).toBe("Body");
  });

  it("title-cases unknown package names (e.g. column -> Column)", () => {
    expect(displayName("column")).toBe("Column");
    expect(displayName("text")).toBe("Text");
  });

  it("converts kebab-case to Title Case for unknown packages", () => {
    expect(displayName("some-package")).toBe("SomePackage");
  });
});

describe("parseChangelog", () => {
  it("parses version headers and bullet lists", () => {
    const content = `
# pkg

## 1.0.0

### Patch Changes

- abc1234: first change
- second change

## 0.9.0

### Minor Changes

- add feature
`;
    const versions = parseChangelog(content);
    expect(versions).toHaveLength(2);
    expect(versions[0]).toEqual({ version: "1.0.0", bullets: ["first change", "second change"] });
    expect(versions[1]).toEqual({ version: "0.9.0", bullets: ["add feature"] });
  });

  it("strips commit hash prefix from bullets", () => {
    const content = `
## 0.2.1

### Patch Changes

- 8b7a660: remove use of devEngines which npm detects
`;
    const versions = parseChangelog(content);
    expect(versions[0].bullets).toEqual(["remove use of devEngines which npm detects"]);
  });

  it("strips [hash] suffix from bullets", () => {
    const content = `
## 1.0.0

### Patch Changes

- Updated dependencies [698f962]
`;
    const versions = parseChangelog(content);
    expect(versions[0].bullets).toEqual(["Updated dependencies"]);
  });

  it("skips canary versions", () => {
    const content = `
## 1.0.0

- change one

## 1.0.0-canary.0

- canary change

## 0.9.0

- change two
`;
    const versions = parseChangelog(content);
    expect(versions).toHaveLength(2);
    expect(versions[0].version).toBe("1.0.0");
    expect(versions[1].version).toBe("0.9.0");
  });

  it("returns empty bullets when only subheaders exist", () => {
    const content = `
## 2.0.0

### Major Changes

### Patch Changes
`;
    const versions = parseChangelog(content);
    expect(versions[0].bullets).toEqual([]);
  });
});

describe("getTagDate", () => {
  it("returns null when exec fails (e.g. missing tag)", () => {
    const fakeExec = vi.fn(() => {
      throw new Error("not found");
    });
    expect(getTagDate("nonexistent@1.0.0", "/tmp", fakeExec)).toBeNull();
  });

  it("returns dateKey and header when exec returns ISO date", () => {
    const fakeExec = vi.fn(() => "2025-12-29 09:58:25 -0300");
    const result = getTagDate("body@0.2.1", "/tmp", fakeExec);
    expect(result).toEqual({ dateKey: "2025-12-29", header: "December 29, 2025" });
  });

  it("returns null when exec returns empty string", () => {
    const fakeExec = vi.fn(() => "");
    expect(getTagDate("x@1.0.0", "/tmp", fakeExec)).toBeNull();
  });
});

describe("getTagForPackage", () => {
  it("returns react-email@version for react-email package", () => {
    expect(getTagForPackage("react-email", "5.0.0")).toBe("react-email@5.0.0");
  });

  it("returns create-email@version for create-email package", () => {
    expect(getTagForPackage("create-email", "1.0.0")).toBe("create-email@1.0.0");
  });

  it("returns @react-email/pkg@version for scoped packages", () => {
    expect(getTagForPackage("body", "0.2.1")).toBe("@react-email/body@0.2.1");
    expect(getTagForPackage("code-block", "0.2.0")).toBe("@react-email/code-block@0.2.0");
  });
});

describe("alreadyInDocs", () => {
  it("returns true when content has **Name X.Y.Z**", () => {
    const content = "## Date\n\n**Body 0.2.1**\n\n- change";
    expect(alreadyInDocs(content, "Body", "0.2.1")).toBe(true);
  });

  it("returns true when content has **Name `X.Y.Z`** (backticks)", () => {
    const content = "**React Email `4.0.0`**\n\n- change";
    expect(alreadyInDocs(content, "React Email", "4.0.0")).toBe(true);
  });

  it("returns false when version is not present", () => {
    const content = "**Body 0.2.0**\n\n- change";
    expect(alreadyInDocs(content, "Body", "0.2.1")).toBe(false);
  });

  it("is case-insensitive for name", () => {
    const content = "**body 0.2.1**\n\n- change";
    expect(alreadyInDocs(content, "Body", "0.2.1")).toBe(true);
  });

  it("escapes special regex characters in name and version", () => {
    const content = "**Code Block 0.2.0**\n\n- fix";
    expect(alreadyInDocs(content, "Code Block", "0.2.0")).toBe(true);
  });
});

describe("entryOrder", () => {
  it("orders by ORDER list when both names are in list", () => {
    expect(entryOrder({ name: "React Email" }, { name: "Body" })).toBeLessThan(0);
    expect(entryOrder({ name: "Body" }, { name: "React Email" })).toBeGreaterThan(0);
    expect(entryOrder({ name: "Preview Server" }, { name: "Create Email" })).toBeLessThan(0);
  });

  it("puts unknown names after known names", () => {
    expect(entryOrder({ name: "React Email" }, { name: "Unknown" })).toBeLessThan(0);
    expect(entryOrder({ name: "Unknown" }, { name: "Body" })).toBeGreaterThan(0);
  });

  it("uses localeCompare for two unknown names", () => {
    expect(entryOrder({ name: "Alpha" }, { name: "Beta" })).toBeLessThan(0);
  });
});

describe("cleanBullets", () => {
  it("filters out (no changelog bullets)", () => {
    expect(cleanBullets(["(no changelog bullets)", "real change"])).toEqual(["real change"]);
  });

  it("strips leading - and trims", () => {
    expect(cleanBullets(["- bullet one", "  - bullet two  "])).toEqual(["bullet one", "bullet two"]);
  });

  it("filters out empty strings after trim", () => {
    expect(cleanBullets(["  ", "ok", ""])).toEqual(["ok"]);
  });

  it("returns empty array when only placeholders", () => {
    expect(cleanBullets(["(no changelog bullets)"])).toEqual([]);
  });
});

describe("toMdxBlock", () => {
  it("formats entry with bullets", () => {
    const entry = { name: "Body", version: "0.2.1", bullets: ["first", "second"] };
    expect(toMdxBlock(entry)).toBe(
      "**Body 0.2.1**\n\n- first\n- second"
    );
  });

  it("uses (no release notes) when bullets are empty after clean", () => {
    const entry = { name: "React Email", version: "5.0.0", bullets: ["(no changelog bullets)"] };
    expect(toMdxBlock(entry)).toContain("(no release notes)");
  });

  it("cleans bullets before formatting", () => {
    const entry = { name: "Tailwind", version: "2.0.0", bullets: ["- strip leading dash"] };
    expect(toMdxBlock(entry)).toBe(
      "**Tailwind 2.0.0**\n\n- strip leading dash"
    );
  });
});

describe("toMdxSection", () => {
  it("produces ## header and sorted entry blocks", () => {
    const data = {
      header: "December 29, 2025",
      entries: [
        { name: "Body", version: "0.2.1", bullets: ["change"] },
        { name: "React Email", version: "5.1.1", bullets: ["other"] },
      ],
    };
    const out = toMdxSection("2025-12-29", data);
    expect(out).toMatch(/^## December 29, 2025\n\n/);
    expect(out).toContain("**React Email 5.1.1**");
    expect(out).toContain("**Body 0.2.1**");
    expect(out.indexOf("React Email")).toBeLessThan(out.indexOf("Body"));
  });
});

describe("dateHeaderToKey", () => {
  it("converts full month name to YYYY-MM-DD", () => {
    expect(dateHeaderToKey("December 29, 2025")).toBe("2025-12-29");
    expect(dateHeaderToKey("January 7, 2026")).toBe("2026-01-07");
  });

  it("converts abbreviated month to YYYY-MM-DD", () => {
    expect(dateHeaderToKey("Nov 08, 2024")).toBe("2024-11-08");
    expect(dateHeaderToKey("Apr 09, 2025")).toBe("2025-04-09");
  });

  it("strips ## prefix if present", () => {
    expect(dateHeaderToKey("## December 29, 2025")).toBe("2025-12-29");
  });

  it("handles optional comma after day", () => {
    expect(dateHeaderToKey("Dec 10, 2024")).toBe("2024-12-10");
    expect(dateHeaderToKey("Dec 10 2024")).toBe("2024-12-10");
  });

  it("returns null for invalid header", () => {
    expect(dateHeaderToKey("not a date")).toBeNull();
    expect(dateHeaderToKey("")).toBeNull();
  });

  it("returns null for unknown month name", () => {
    expect(dateHeaderToKey("Notmonth 1, 2025")).toBeNull();
  });
});
