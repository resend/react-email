import logSymbols from 'log-symbols';
import prompts from 'prompts';
import { conf } from '../utils/conf.js';
import { styleText } from '../utils/style-text.js';

export async function resendSetup(apiKey: string) {
  const previousValue = conf.get('resendApiKey');
  if (typeof previousValue === 'string' && previousValue.length > 0) {
    const response = await prompts({
      type: 'confirm',
      name: 'replaceApiKey',
      message: `You already have a Resend API Key configured (${styleText('grey', previousValue.slice(0, 11))}...). Do you want to replace it?`,
      initial: false,
    });
    if (!response.replaceApiKey) {
      process.exit(0);
    }
  }

  conf.set('resendApiKey', apiKey);
  console.info(`${logSymbols.success} Resend integration successfully set up`);
}
