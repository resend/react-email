import Conf from 'conf';

// Just simple encryption. This isn't completely safe
// because anyone can find this key here
const encryptionKey = 'h2#x658}1#qY(@!:7,BD1J)q12$[tM25';

export const conf = new Conf<{
  resendApiKey?: string;
}>({ projectName: 'react-email', encryptionKey });
