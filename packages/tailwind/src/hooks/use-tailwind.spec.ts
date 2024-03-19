import { useTailwind } from "./use-tailwind";

test("useTailwind()", () => {
  const tailwind = useTailwind({});

  expect(
    tailwind
      .generateRootForClasses([
        "text-red-500",
        "sm:bg-blue-300",
        "bg-slate-900",
      ])
      .toString(),
  ).toMatchSnapshot();
});
