import type { HardBreakOptions } from '@tiptap/extension-hard-break';
import HardBreakBase from '@tiptap/extension-hard-break';

export { type HardBreakOptions };

export const HardBreak = HardBreakBase.extend({
  renderToReactEmail() {
    return <br />;
  },
});
