import fs from 'node:fs';
import { setupHotreloading, startDevServer } from '../utils/index.js';

interface Args {
  dir: string;
  port: string;
  clients: string;
}

const validEmailClients = [
  'gmail',
  'outlook',
  'yahoo',
  'apple-mail',
  'aol',
  'thunderbird',
  'microsoft',
  'samsung-email',
  'sfr',
  'orange',
  'protonmail',
  'hey',
  'mail-ru',
  'fastmail',
  'laposte',
  't-online-de',
  'free-fr',
  'gmx',
  'web-de',
  'ionos-1and1',
  'rainloop',
  'wp-pl',
] as const;

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

    const clientsArray = clients.split(/\s*,\s*/);
    for (const client of clientsArray) {
      if (!(validEmailClients as readonly string[]).includes(client)) {
        console.error(
          `${client} is not one of the clients we support. Valid options are ${validEmailClients.join(', ')}`,
        );
        process.exit(1);
      }
    }

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
