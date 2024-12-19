import path from 'node:path';
import { $ } from './utils/run-testing-command';

test.sequential("Tailwind works on the Vite App's build process", () => {
  const viteAppLocation = path.resolve(__dirname, '../vite');
  $('npm install', viteAppLocation);
  $('npm run build', viteAppLocation);
});
