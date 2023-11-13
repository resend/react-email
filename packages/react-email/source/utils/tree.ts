import treeCli from 'tree-cli';

export const tree = async (dir: string, depth: number) => {
  const { report } = await treeCli({
    l: depth,
    base: dir,
  });

  return report;
};
