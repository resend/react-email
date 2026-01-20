import { readPreState } from '@changesets/pre';

(async () => {
  const preState = await readPreState(process.cwd());
  if (preState?.mode === 'pre') {
    console.log('Is in prerelease mode, making automated release');
    await import('./release.js');
  } else {
    console.log(
      'Was not in prerelease, skipping automated release. To release this you should rebase onto main',
    );
  }
})();
