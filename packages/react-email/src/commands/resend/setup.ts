import logSymbols from 'log-symbols';
import prompts from 'prompts';
import { conf } from '../../utils/conf.js';
import { styleText } from '../../utils/style-text.js';

export async function resendSetup() {
  const previousValue = conf.get('resendApiKey');
  if (typeof previousValue === 'string' && previousValue.length > 0) {
    console.info(
      `You already have a Resend API Key configured (${styleText('grey', previousValue.slice(0, 11))}...), continuing will replace it.`,
    );
  }

  const { apiKey } = await prompts({
    type: 'password',
    name: 'apiKey',
    message: 'Enter your API Key (make sure it has "Full Access")',
  });

  if (apiKey?.trim().length > 0) {
    conf.set('resendApiKey', apiKey);
    console.info(
      `${logSymbols.success} Resend integration successfully set up`,
    );
    console.info(
      `You can always remove it with ${styleText('green', 'npx react-email@latest resend reset')}`,
    );
  }
}
