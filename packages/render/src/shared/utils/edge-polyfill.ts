/**
 * MessageChannel is not supported in Edge, but it's not needed to successfully render.
 * This polyfill is used to avoid errors when importing the package in an vercel edge and cf worker runtimes.
 *
 * @see https://github.com/resend/react-email/issues/1630#issuecomment-2773421899
 *
 * We can remove this once MessageChannel is supported on all runtimes.
 */
class MockMessagePort {
  onmessage: ((ev: MessageEvent) => void) | undefined;
  onmessageerror: ((ev: MessageEvent) => void) | undefined;

  close() { }
  postMessage(_message: unknown, _transfer: Transferable[] = []) { }
  start() { }
  addEventListener() { }
  removeEventListener() { }
  dispatchEvent(_event: Event): boolean {
    return false;
  }
}

class MockMessageChannel {
  port1: MockMessagePort;
  port2: MockMessagePort;

  constructor() {
    this.port1 = new MockMessagePort();
    this.port2 = new MockMessagePort();
  }
}

export const applyMessageChannelPolyfill = () => {
  globalThis.MessageChannel =
    MockMessageChannel as unknown as typeof MessageChannel;
};
