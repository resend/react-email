import treeCLI from 'tree-cli';

export async function tree(dir: string, depth: number) {
  const { report } = await treeCLI({
    l: depth,
    base: dir
  });

  return report;
}
