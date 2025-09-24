import path from 'node:path';
import { getEnvironmentData } from './collect-usage-data.js';

test('getEnvironmentData() in our demo', async () => {
  const demoPath = path.resolve(import.meta.dirname, '../../../../apps/demo');
  expect(
    await getEnvironmentData(demoPath, path.resolve(demoPath, 'emails')),
  ).toMatchSnapshot();
});
