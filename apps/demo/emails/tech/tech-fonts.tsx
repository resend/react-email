import { Font } from "@react-email/components";

const geistLatinWoff2 =
  "https://fonts.gstatic.com/s/geist/v4/gyByhwUxId8gMEwcGFU.woff2";

/** Geist + Inter via `@react-email/components` (avoids `<style>` + `@import`, which Gmail strips). */
export function TechFonts() {
  return (
    <>
      <Font
        fontFamily="Geist"
        fallbackFontFamily={["Arial", "sans-serif"]}
        webFont={{ url: geistLatinWoff2, format: "woff2" }}
        fontWeight={400}
        fontStyle="normal"
      />
      <Font
        fontFamily="Geist"
        fallbackFontFamily={["Arial", "sans-serif"]}
        webFont={{ url: geistLatinWoff2, format: "woff2" }}
        fontWeight={450}
        fontStyle="normal"
      />
      <Font
        fontFamily="Geist"
        fallbackFontFamily={["Arial", "sans-serif"]}
        webFont={{ url: geistLatinWoff2, format: "woff2" }}
        fontWeight={500}
        fontStyle="normal"
      />
      <Font
        fontFamily="Geist"
        fallbackFontFamily={["Arial", "sans-serif"]}
        webFont={{ url: geistLatinWoff2, format: "woff2" }}
        fontWeight={600}
        fontStyle="normal"
      />
      <Font
        fontFamily="Geist"
        fallbackFontFamily={["Arial", "sans-serif"]}
        webFont={{ url: geistLatinWoff2, format: "woff2" }}
        fontWeight={700}
        fontStyle="normal"
      />
      <Font
        fontFamily="Inter"
        fallbackFontFamily={["Arial", "sans-serif"]}
        webFont={{
          url: "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuOKfMZg.ttf",
          format: "truetype",
        }}
        fontWeight={400}
        fontStyle="normal"
      />
      <Font
        fontFamily="Inter"
        fallbackFontFamily={["Arial", "sans-serif"]}
        webFont={{
          url: "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuOKfMZg.ttf",
          format: "truetype",
        }}
        fontWeight={450}
        fontStyle="normal"
      />
      <Font
        fontFamily="Inter"
        fallbackFontFamily={["Arial", "sans-serif"]}
        webFont={{
          url: "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fMZg.ttf",
          format: "truetype",
        }}
        fontWeight={500}
        fontStyle="normal"
      />
      <Font
        fontFamily="Inter"
        fallbackFontFamily={["Arial", "sans-serif"]}
        webFont={{
          url: "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYMZg.ttf",
          format: "truetype",
        }}
        fontWeight={600}
        fontStyle="normal"
      />
    </>
  );
}
