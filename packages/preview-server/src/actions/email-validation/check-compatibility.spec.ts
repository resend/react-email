import fs from 'node:fs/promises';
import path from 'node:path';
import {
  type CompatibilityCheckingResult,
  checkCompatibility,
} from './check-compatibility';

describe('checkCompatibility()', () => {
  describe('with style variables', () => {
    it('catches code from inner components', async () => { });

    it('catches accent-color usage', async () => {
      const results: CompatibilityCheckingResult[] = [];
      const reactPath = path.resolve(
        import.meta.dirname,
        './test/style-variables/accent-color.tsx',
      );
      const reactCode = await fs.readFile(reactPath, 'utf8');
      const stream = await checkCompatibility(reactCode, reactPath);

      const reader = stream.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (value) {
          results.push(value);
        }
        if (done) {
          break;
        }
      }

      expect(
        results.some(
          (result) =>
            result.status === 'error' && result.source.includes('accentColor'),
        ),
        'expect accentColor to be flagged with an error',
      ).toBe(true);
    });
  });
});
