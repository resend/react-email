import { applyMessageChannelPolyfill } from '../shared/utils/edge-polyfill';

if (typeof MessageChannel === 'undefined') {
  applyMessageChannelPolyfill();
}

import type { Options } from '../shared/options';
import { render } from './render';

/**
 * @deprecated use {@link render}
 */
export const renderAsync = (element: React.ReactElement, options?: Options) => {
  return render(element, options);
};

export * from '../shared/options';
export * from '../shared/plain-text-selectors';
export * from '../shared/utils/pretty';
export * from './render';
