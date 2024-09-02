import { render } from "@react-email/render";
import { useTailwindStyles } from "./use-tailwind-styles";

describe("useTailwindStyles()", () => {
  test("with basic media queries and nested elements", async () => {
    const Comp = () => {
      const node = (
        <div className="w-full md:w-[250px] bg-red-500">
          <span className="well-hello text-red-100">Well, hello friends!</span>
        </div>
      );

      expect(useTailwindStyles(node, {})).toEqual({
        stylePerClassMap: {
          "w-full": { width: "100%" },
          "bg-red-500": { backgroundColor: "rgb(239,68,68)" },
          "text-red-100": { color: "rgb(254,226,226)" },
        },
        sanitizedMediaQueries: [
          "@media (min-width: 768px) {.md_w-250px {width: 250px!important}}",
        ],
        nonInlinableClasses: ["md:w-[250px]"],
      });
      return undefined;
    };

    await render(<Comp />);
  });

  test("with more media queries", async () => {
    const Comp = () => {
      const node = (
        <div className="bg-red-200 sm:bg-red-300 md:bg-red-400 lg:bg-red-500" />
      );

      expect(useTailwindStyles(node, {})).toEqual({
        stylePerClassMap: {
          "bg-red-200": { backgroundColor: "rgb(254,202,202)" },
        },
        sanitizedMediaQueries: [
          "@media (min-width: 640px) {.sm_bg-red-300 {background-color: rgb(252,165,165)!important}}",
          "@media (min-width: 768px) {.md_bg-red-400 {background-color: rgb(248,113,113)!important}}",
          "@media (min-width: 1024px) {.lg_bg-red-500 {background-color: rgb(239,68,68)!important}}",
        ],
        nonInlinableClasses: [
          "sm:bg-red-300",
          "md:bg-red-400",
          "lg:bg-red-500",
        ],
      });

      return undefined;
    };

    await render(<Comp />);
  });
});
