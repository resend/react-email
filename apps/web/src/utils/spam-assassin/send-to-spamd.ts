import crypto from 'node:crypto';
import net from 'node:net';
import { env } from '../../env.mjs';

const timeout = 10_000;

export const sendToSpamd = (html: string, plainText: string) => {
  return new Promise<string>((resolve, reject) => {
    const connection = net.createConnection({
      host: env.spamAssassinHost,
      port: env.spamAssassinPort,
    });
    connection.setTimeout(timeout, () => {
      reject(
        new Error('Timed out trying to connect to spamc', {
          cause: {
            host: env.spamAssassinHost,
            port: env.spamAssassinPort,
          },
        }),
      );
    });

    connection.on('connect', () => {
      const boundary = `Part_${crypto.randomBytes(16).toString('hex')}`;
      const message = [
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

      const command = [
        'PROCESS SPAMC/1.5',
        `Content-length: ${Buffer.byteLength(message)}`,
        '',
        message,
      ].join('\r\n');

      connection.write(command);
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
