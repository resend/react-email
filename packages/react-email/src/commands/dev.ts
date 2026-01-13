import fs from 'node:fs';
import { setupHotreloading, startDevServer } from '../utils/index.js';
import { validateEmailClientList } from '../utils/validate-email-client-list.js';

interface Args {
  dir: string;
  port: string;
  clients: string;
}

export const dev = async ({
  dir: emailsDirRelativePath,
  port,
  clients,
}: Args) => {
  try {
    if (!fs.existsSync(emailsDirRelativePath)) {
      console.error(`Missing ${emailsDirRelativePath} folder`);
      process.exit(1);
    }

    const clientsArray = validateEmailClientList(clients);

    const devServer = await startDevServer(
      emailsDirRelativePath,
      emailsDirRelativePath, // defaults to ./emails/static for the static files that are served to the preview
      Number.parseInt(port, 10),
      clientsArray,
    );

    await setupHotreloading(devServer, emailsDirRelativePath);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
