/**
 * This is the export type for NextJS's edge runtime. We always apply the polyfill here
 * since NextJS patches `MessageChannel` to be a function that throws an error when called.
 *
 * @see https://github.com/resend/react-email/pull/2222#issuecomment-2858463529
 */
import { applyMessageChannelPolyfill } from '../shared/utils/edge-polyfill';

applyMessageChannelPolyfill();

import { render } from '../browser/render';
import type { Options } from '../shared/options';

/**
 * @deprecated use {@link render}
 */
export const renderAsync = (element: React.ReactElement, options?: Options) => {
  return render(element, options);
};

export * from '../browser/render';
export * from '../shared/options';
export * from '../shared/plain-text-selectors';
export * from '../shared/utils/pretty';
