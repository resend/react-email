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
export { createSlashCommand } from './create-slash-command';
export { filterAndRankItems, scoreItem } from './search';
export type {
  CommandListComponent,
  CommandListProps,
  CommandListRef,
  SearchableItem,
  SlashCommandItem,
  SlashCommandProps,
} from './types';
export { isAtMaxColumnsDepth, isInsideNode } from './utils';

import { createSlashCommand } from './create-slash-command';

export const SlashCommand = createSlashCommand();
