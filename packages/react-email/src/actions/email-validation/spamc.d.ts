declare module "spamc" {
  export interface CheckResponse {
    responseCode: number,
    responseMessage: string,
    isSpam: boolean,
    spamScore: number,
    baseSpamScore: number
  }

  export interface ProcessResponse {
    responseCode: number,
    responseMessage: string,
    isSpam: boolean,
    spamScore: number,
    baseSpamScore: number,
    matches: string[]
    message: string
  }

  class Client {
    constructor(host?: string, port?: string, timeout?: number);

    ping(
      onResponse: (error: Error | null, responded: boolean) => void
    ): void;

    check(
      message: string,
      onResponse: (error: Error | null, response?: CheckResponse) => void
    ): void;

    process(
      message: string,
      onResponse: (error: Error | null, response?: null) => void
    );

    // It does implement other functions that we might want to define types for.
    // Here's the source https://github.com/Flolagale/spamc/blob/master/index.js#L336
  }

  export = Client;
}
