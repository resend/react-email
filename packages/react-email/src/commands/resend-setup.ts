import Conf from 'conf';
import logSymbols from 'log-symbols';
import prompts from 'prompts';
import { styleText } from '../utils/style-text.js';

// just simple encryption, this isn't completely safe because anyone can find this key here
const encryptionKey = 'h2#x658}1#qY(@!:7,BD1J)q12$[tM25';

export async function resendSetup(apiKey: string) {
  const conf = new Conf({ projectName: 'react-email', encryptionKey });
  const previousValue = conf.get('apiKey');
  if (typeof previousValue === 'string' && previousValue.length > 0) {
    const response = await prompts({
      type: 'confirm',
      name: 'replaceApiKey',
      message: `You already have an API Key configured (${styleText('grey', previousValue.slice(0, 11))}...). This will replace it, do you want to continue?`,
      initial: false,
    });
    if (!response.replaceApiKey) {
      process.exit(0);
    }
  }

  conf.set('apiKey', apiKey);
  console.info(`${logSymbols.success} Resend integration successfully set up`);
}
