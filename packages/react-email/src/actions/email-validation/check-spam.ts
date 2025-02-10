'use server';
// import Client from 'spamc';
//
// const client = new Client();
//
// export const checkSpam = async (code: string) => {
//   return new Promise((resolve, reject) => {
//     client.process(code, (err, response) => {
//       if (err !== null) {
//         reject(err);
//         return;
//       }
//
//       resolve(response!);
//     });
//   });
// };

import net from 'node:net';
import crypto from 'node:crypto';
const host = '127.0.0.1';
const port = 783;
const timeout = 20_000;

interface Check {
  name: string;
  points: number;
  description: string;
}

interface SpamCheckingResult {
  isSpam: boolean;
  points: number;
  checks: Check[];
}

const sendToSpamd = (html: string, plainText: string) => {
  return new Promise<string>((resolve, reject) => {
    const connection = net.createConnection({
      host,
      port,
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
      const message = [
        'MIME-Version: 1.0',
        `Content-Type: multipart/alternative; boundary="${boundary}"`,
        '',
        `--${boundary}`,
        'Content-Type: text/plain; charset="UTF-8"',
        `Content-Length: ${Buffer.byteLength(plainText.trim())}`,
        '',
        plainText.trim(),
        '',
        `--${boundary}`,
        'Content-Type: text/html; charset="UTF-8"',
        `Content-Length: ${Buffer.byteLength(html.trim())}`,
        '',
        html.trim(),
        '',
        `--${boundary}--`,
        '',
      ].join('\r\n');

      const command = [
        'PROCESS SPAMC/1.5',
        // `Content-length: ${Buffer.byteLength(message)}`,
        message,
      ].join('\r\n');
      console.log(message.replaceAll('\n', '\\n').replaceAll('\r', '\\r'));
      connection.write(message);
    });

    connection.on('error', (error) => {
      console.log(error);
      reject(error);
    });

    let response = '';

    connection.on('data', (buffer) => {
      console.log(buffer);
      response += buffer.toString('utf8');
    });

    connection.on('close', (hadError) => {
      if (hadError) return;

      resolve(response);
    });
  });
};

export const checkSpam = async (html: string, plainText: string) => {
  const response = await sendToSpamd(html, plainText);

  console.log(response);
};
