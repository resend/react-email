import { setupTailwind } from './setup-tailwind';

test("tailwind's generateRootForClasses()", () => {
  const tailwind = setupTailwind({});

  expect(
    tailwind
      .generateRootForClasses([
        'text-red-500',
        'sm:bg-blue-300',
        'bg-slate-900',
      ])
      .toString(),
  ).toMatchSnapshot();
});
