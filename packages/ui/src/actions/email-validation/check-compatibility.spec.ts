import {
  type CompatibilityCheckingResult,
  checkCompatibility,
} from './check-compatibility';

const collect = async (reactCode: string) => {
  const results: CompatibilityCheckingResult[] = [];
  const stream = await checkCompatibility(reactCode, '');
  const reader = stream.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (value) results.push(value);
    if (done) break;
  }
  return results;
};

const findHslResult = (results: CompatibilityCheckingResult[]) =>
  results.find((result) => result.entry.slug === 'css-hsl-hsla');

describe('checkCompatibility() — hsl()/hsla() detection', () => {
  it('flags background-color: hsl(...) as Outlook-incompatible', async () => {
    const results = await collect(
      "<Section style={{ backgroundColor: 'hsl(200, 50%, 50%)' }} />",
    );
    const hslResult = findHslResult(results);
    expect(hslResult).toBeDefined();
    expect(hslResult?.status).toBe('error');
    expect(hslResult?.statsPerEmailClient.outlook?.status).toBe('error');
  });

  it('flags color: hsla(...) as Outlook-incompatible', async () => {
    const results = await collect(
      "<Section style={{ color: 'hsla(120, 100%, 50%, 0.5)' }} />",
    );
    const hslResult = findHslResult(results);
    expect(hslResult).toBeDefined();
    expect(hslResult?.status).toBe('error');
  });

  it('tolerates whitespace variations in hsl() arguments', async () => {
    const results = await collect(
      "<Section style={{ backgroundColor: 'hsl( 200 , 50% , 50% )' }} />",
    );
    expect(findHslResult(results)).toBeDefined();
  });

  it('does not flag hex or rgb() colors', async () => {
    const results = await collect(
      "<Section style={{ color: '#ff0000', backgroundColor: 'rgb(255, 0, 0)' }} />",
    );
    expect(findHslResult(results)).toBeUndefined();
  });
});
