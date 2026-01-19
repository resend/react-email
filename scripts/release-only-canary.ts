import { readPreState } from '@changesets/pre';
import { runScript } from 'nypm';

(async () => {
  const preState = await readPreState(process.cwd());
  if (preState?.mode === 'pre') {
    console.log('Is in prerelease mode, making automated release');
    await runScript('release');
  } else {
    console.log(
      'Was not in prerelease, skipping automated release. To release this you should rebase onto main',
    );
  }
})();
