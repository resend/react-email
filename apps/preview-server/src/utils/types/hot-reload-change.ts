export interface HotReloadChange {
  filename: string;
  event:
    | 'all'
    | 'ready'
    | 'add'
    | 'change'
    | 'addDir'
    | 'unlink'
    | 'unlinkDir'
    | 'raw'
    | 'error';
}
