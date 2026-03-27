import { CommandList } from './command-list';
import { SlashCommandRoot } from './root';

export const SlashCommand = {
  Root: SlashCommandRoot,
  CommandList,
} as const;

export { CommandList } from './command-list';
export {
  BULLET_LIST,
  BUTTON,
  CODE,
  DIVIDER,
  defaultSlashCommands,
  FOUR_COLUMNS,
  H1,
  H2,
  H3,
  NUMBERED_LIST,
  QUOTE,
  SECTION,
  TEXT,
  THREE_COLUMNS,
  TWO_COLUMNS,
} from './commands';
export { filterAndRankItems, scoreItem } from './search';
export type {
  CommandListProps,
  SearchableItem,
  SlashCommandItem,
  SlashCommandProps,
  SlashCommandRenderProps,
  SlashCommandRootProps,
} from './types';
export { isAtMaxColumnsDepth, isInsideNode } from './utils';
