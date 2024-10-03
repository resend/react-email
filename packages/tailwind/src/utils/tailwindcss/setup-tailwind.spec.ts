import { setupTailwind } from "./setup-tailwind";

test("setupTailwind()", async () => {
  const tailwind = setupTailwind({});

  expect(
    (
      await tailwind.generateRootForClasses([
        "text-red-500",
        "sm:bg-blue-300",
        "bg-slate-900",
      ])
    ).toString(),
  ).toMatchSnapshot();
});
