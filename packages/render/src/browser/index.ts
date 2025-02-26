import { render } from './render';
import type { Options } from '../shared/options';

/**
  * @deprecated use {@link render}
  */
export const renderAsync = (element: React.ReactElement, options?: Options) => {
  return render(element, options);
}

export * from './render';

export * from '../shared/options';
export * from '../shared/plain-text-selectors';
