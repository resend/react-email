// Fixture for the `--esbuild-plugins` option: a TypeScript module using syntax
// Node can't strip on its own, so loading it needs a real transpiler.
import type { Plugin } from 'esbuild';

enum PluginName {
  Typed = 'typed-plugin',
}

const plugins: Plugin[] = [{ name: PluginName.Typed, setup() {} }];

export default plugins;
