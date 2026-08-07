import { type Declaration, generate, parse, type Value } from 'css-tree';
import { getCustomProperties } from './get-custom-properties.js';
import { resolveVariableFunctions } from './resolve-variable-functions.js';

const parseValue = (value: string) =>
  parse(value, { context: 'value' }) as Value;

const makeVariableDeclaration = (
  property: string,
  value: string,
): Declaration => ({
  type: 'Declaration',
  important: false,
  property,
  value: parseValue(value),
});

describe('resolveVariableFunctions()', () => {
  it('inlines a local variable value into a var() reference', () => {
    const localVariableDeclarations = new Map([
      ['--gap', makeVariableDeclaration('--gap', '8px')],
    ]);

    const value = parseValue('var(--gap)');
    resolveVariableFunctions(value, localVariableDeclarations, new Map());

    expect(generate(value)).toBe('8px');
  });

  it('falls back to a custom property initial value when no local exists', () => {
    const customProperties = getCustomProperties(
      parse(
        '@property --alpha { syntax: "*"; inherits: false; initial-value: 100%; }',
      ),
    );

    const value = parseValue('rgb(0, 0, 0, var(--alpha))');
    resolveVariableFunctions(value, new Map(), customProperties);

    expect(generate(value)).toBe('rgb(0,0,0,100%)');
  });

  it('resolves a variable that itself references another variable regardless of ordering', () => {
    const customProperties = getCustomProperties(
      parse(
        '@property --alpha { syntax: "*"; inherits: false; initial-value: 100%; }',
      ),
    );
    const localVariableDeclarations = new Map([
      [
        '--shadow-color',
        makeVariableDeclaration('--shadow-color', 'var(--alpha)'),
      ],
    ]);

    const value = parseValue('0 1px 3px rgb(85, 85, 85, var(--shadow-color))');
    resolveVariableFunctions(
      value,
      localVariableDeclarations,
      customProperties,
    );

    expect(generate(value)).toBe('0 1px 3px rgb(85,85,85,100%)');
  });

  it('leaves the reference untouched when a variable is unknown', () => {
    const value = parseValue('var(--missing)');
    resolveVariableFunctions(value, new Map(), new Map());

    expect(generate(value)).toBe('var(--missing)');
  });

  it('does not loop forever on a self-referential variable', () => {
    const localVariableDeclarations = new Map([
      ['--loop', makeVariableDeclaration('--loop', 'var(--loop)')],
    ]);

    const value = parseValue('var(--loop)');
    resolveVariableFunctions(value, localVariableDeclarations, new Map());

    expect(generate(value)).toBe('var(--loop)');
  });
});
