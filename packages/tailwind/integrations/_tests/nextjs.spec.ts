import path from 'node:path';
import { $ } from './utils/run-testing-command';

test.sequential("Tailwind works on the Next App's build process", () => {
  const nextAppLocation = path.resolve(__dirname, '../nextjs');
  $('npm install', nextAppLocation);
  $('npm run build', nextAppLocation);
});
