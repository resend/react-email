import crypto from 'node:crypto';
import net from 'node:net';

const host = process.env.SPAM_ASSASSIN_HOST;
const port = process.env.SPAM_ASSASSIN_PORT;
const timeout = 10_000;

export const sendToSpamd = (html: string, plainText: string) => {
  return new Promise<string>((resolve, reject) => {
    if (!host || !port) {
      reject(
        new Error('Host and port for spam assasin must be specified', {
          cause: {
            host,
            port,
            html,
            plainText,
          },
        }),
      );
      return;
    }

    const connection = net.createConnection({
      host,
      port: Number.parseInt(port),
    });
    connection.setTimeout(timeout, () => {
      reject(
        new Error('Timed out trying to connect to spamc', {
          cause: {
            port,
            host,
          },
        }),
      );
    });

    connection.on('connect', () => {
      const boundary = `Part_${crypto.randomBytes(16).toString('hex')}`;
      const command = [
        'PROCESS SPAMC/1.5',
        '',
        'MIME-Version: 1.0',
        `Content-Type: multipart/alternative; boundary="${boundary}"`,
        '',
        `--${boundary}`,
        'Content-Type: text/html; charset="UTF-8"',
        `Content-Length: ${Buffer.byteLength(html.trim())}`,
        '',
        html.trim(),
        '',
        `--${boundary}`,
        'Content-Type: text/plain; charset="UTF-8"',
        `Content-Length: ${Buffer.byteLength(plainText.trim())}`,
        '',
        plainText.trim(),
        '',
        `--${boundary}--`,
        '',
      ].join('\r\n');

      connection.end(command);
    });

    connection.on('error', (error) => {
      reject(error);
    });

    let response = '';

    connection.on('data', (buffer) => {
      response += buffer.toString('utf8');
    });

    connection.on('close', (hadError) => {
      if (hadError) return;

      resolve(response);
    });
  });
};
