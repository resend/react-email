import path from 'node:path';
import { $ } from './utils/run-testing-command';

describe('integrations', () => {
  beforeAll(() => {
    const reactEmailLocation = path.resolve(__dirname, '../../../../..');
    //$('pnpm build:package', reactEmailLocation);
    $('yalc installations clean react-email', reactEmailLocation);
    $('yalc publish', reactEmailLocation);
  });

  const integrationsLocation = path.resolve(__dirname, '..');

  test.sequential("Tailwind works on the Next App's build process", () => {
    const nextAppLocation = path.join(integrationsLocation, 'nextjs');
    $('npm install', nextAppLocation);
    $('npm run build', nextAppLocation);
  });

  test.sequential("Tailwind works on the Vite App's build process", () => {
    const viteAppLocation = path.join(integrationsLocation, 'vite');
    $('npm install', viteAppLocation);
    $('npm run build', viteAppLocation);
  });
});
