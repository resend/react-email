import type { Options } from '../shared/options';
import { render } from './render';

/**
 * @deprecated use {@link render}
 */
export const renderAsync = (element: React.ReactElement, options?: Options) => {
  return render(element, options);
};

export * from '../shared/options';
export * from '../shared/utils/pretty';
export * from '../shared/utils/to-plain-text';
export * from '../shared/utils/to-resend-template';
export * from './render';
