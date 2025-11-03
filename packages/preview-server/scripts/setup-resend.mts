import fs from 'node:fs';
import path from 'node:path';
import logSymbols from 'log-symbols';

const setupResend = async () => {
  const apiKey = process.argv[2];
  const cwd = process.cwd();
  const envPath = path.join(cwd, '.env');
  const envContent = `RESEND_API_KEY=${apiKey || ''}\n`;

  try {
    if (fs.existsSync(envPath)) {
      const currentContent = fs.readFileSync(envPath, 'utf-8');

      if (currentContent.includes('RESEND_API_KEY=')) {
        const newContent = currentContent.replace(
          /RESEND_API_KEY=.*/,
          `RESEND_API_KEY=${apiKey || ''}`,
        );
        fs.writeFileSync(envPath, newContent);
        console.log(logSymbols.success, 'Updated RESEND_API_KEY in .env file');
      } else {
        fs.appendFileSync(envPath, `\n${envContent}`);
        console.log(
          logSymbols.success,
          'Added RESEND_API_KEY to existing .env file',
        );
      }
    } else {
      fs.writeFileSync(envPath, envContent);
      console.log(logSymbols.success, 'Created .env file with RESEND_API_KEY');
    }

    if (!apiKey) {
      console.log(
        '\n🔑 Add your Resend API key by updating the RESEND_API_KEY value in .env',
      );
      console.log('💡 You can also run: pnpm setup:resend <your-api-key>');
    }

    const now = new Date();
    fs.utimesSync(envPath, now, now);
    console.log(
      logSymbols.success,
      'Server will automatically refresh with new API key',
    );
  } catch (error) {
    console.error(
      logSymbols.error,
      'Error creating or updating .env file:',
      error,
    );
    process.exit(1);
  }
};

setupResend();