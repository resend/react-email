import { generate } from 'css-tree';
import { generateRootForClasses } from './generate-root-for-classes';

test("tailwind's generateRootForClasses()", async () => {
  expect(
    generate(
      await generateRootForClasses(
        ['text-red-500', 'sm:bg-blue-300', 'bg-slate-900'],
        {},
      ),
    ),
  ).toMatchSnapshot();
});
