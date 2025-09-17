import { generate } from 'css-tree';
import { setupTailwind } from '../tailwindcss/setup-tailwind';
import { extractRulesMatchingStyles } from './extract-rules-matching-classes';

describe('extractRulesMatchingClasses()', async () => {
  it('should work just inlinable utilities', async () => {
    const tailwind = await setupTailwind({});
    const classes = ['text-center', 'bg-red-500'];
    const cssNode = tailwind.aggregateIntoCss(classes);
    tailwind.dealWithCompatibilityIssues(cssNode);
    const rules = extractRulesMatchingStyles(classes, cssNode);
    const stringifiedRulesMap = Object.fromEntries(
      rules
        .entries()
        .map(([className, { rule }]) => [className, generate(rule)]),
    );

    expect(stringifiedRulesMap).toMatchSnapshot();
  });

  it('should work with non-inlinable utilities', async () => {
    const tailwind = await setupTailwind({});
    const classes = ['lg:w-1/2'];
    const cssNode = tailwind.aggregateIntoCss(classes);
    tailwind.dealWithCompatibilityIssues(cssNode);
    const rules = extractRulesMatchingStyles(classes, cssNode);
    const stringifiedRulesMap = Object.fromEntries(
      rules
        .entries()
        .map(([className, { rule }]) => [className, generate(rule)]),
    );

    expect(stringifiedRulesMap).toMatchSnapshot();
  });

  it('should work with a mix of inlinable and non-inlinable utilities', async () => {
    const tailwind = await setupTailwind({});
    const classes = [
      'text-center',
      'bg-red-500',
      'some-other-class', // should be ignored
      'w-full',
      'lg:w-1/2',
    ];
    const cssNode = tailwind.aggregateIntoCss(classes);
    tailwind.dealWithCompatibilityIssues(cssNode);
    const rules = extractRulesMatchingStyles(classes, cssNode);
    const stringifiedRulesMap = Object.fromEntries(
      rules
        .entries()
        .map(([className, { rule }]) => [className, generate(rule)]),
    );

    expect(stringifiedRulesMap).toMatchSnapshot();
  });
});
