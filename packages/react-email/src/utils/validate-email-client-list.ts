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

export function validateEmailClientList(clients: string) {
  const clientsArray = clients.split(/\s*,\s*/);
  for (const client of clientsArray) {
    if (!(validEmailClients as readonly string[]).includes(client)) {
      console.error(
        `${client} is not one of the clients we support. Valid options are ${validEmailClients.join(', ')}`,
      );
      process.exit(1);
    }
  }
  return clientsArray;
}
