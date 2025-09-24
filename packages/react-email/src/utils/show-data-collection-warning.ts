import fs from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { styleText } from 'node:util';

const firstRunFilepath = path.join(tmpdir(), 'react-email-first-run-date');

export async function showDataCollectionWarning() {
  if (!fs.existsSync(firstRunFilepath)) {
    console.log('');
    console.log(
      `${styleText(
        'yellowBright',
        'Attention',
      )}: React Email collects completely anonymous usage data.`,
    );
    console.log(
      'This usage data is strictly used by us to decide the future roadmap and priorities for the project.',
    );
    console.log('');

    try {
      await fs.promises.writeFile(firstRunFilepath, new Date().toISOString());
    } catch (_error) {
      // Silently fail if we can't write the flag file
      // This ensures the CLI continues to work even if there are permission issues
    }
  }
}
