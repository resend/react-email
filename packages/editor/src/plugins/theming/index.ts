import type { JSONContent } from '@tiptap/core';
import { EDITOR_THEMES } from './themes';

const globalContent = new Map<string, unknown>();

interface PluginsHelpers {
  setGlobalContent: (key: string, value: unknown) => void;
  getGlobalContent: (key: string) => unknown;
}

export const theming = {
  setup({ setGlobalContent }: PluginsHelpers) {
    setGlobalContent('styles', EDITOR_THEMES.basic);
    setGlobalContent('theme', 'basic');
    setGlobalContent('css', '');
  },
  mapNodeStyles(
    node: JSONContent,
    helpers: PluginsHelpers,
  ): React.CSSProperties {
    const styles = helpers.getGlobalContent('styles');

    return {};
  },
};
