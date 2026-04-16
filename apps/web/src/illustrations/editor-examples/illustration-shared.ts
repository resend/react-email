export type IllustrationTone = 'amber' | 'cyan' | 'green' | 'purple' | 'slate';

export type IllustrationProps = {
  tone?: IllustrationTone;
};

export const illustrationSurfaceByTone: Record<
  IllustrationTone,
  { inner: string; outer: string }
> = {
  amber: {
    inner: 'border-amber-6/15',
    outer: 'border-amber-6/30 bg-amber-2/10',
  },
  cyan: {
    inner: 'border-cyan-6/15',
    outer: 'border-cyan-6/30 bg-cyan-2/10',
  },
  green: {
    inner: 'border-green-6/15',
    outer: 'border-green-6/30 bg-green-2/10',
  },
  purple: {
    inner: 'border-purple-6/15',
    outer: 'border-purple-6/30 bg-purple-2/10',
  },
  slate: {
    inner: 'border-slate-6/15',
    outer: 'border-slate-6/30 bg-slate-2/10',
  },
};

export function sectionTitleToTone(sectionTitle: string): IllustrationTone {
  switch (sectionTitle) {
    case 'Advanced':
      return 'purple';
    case 'Getting Started':
      return 'green';
    case 'Intermediate':
      return 'amber';
    case 'One-Line Editor':
      return 'cyan';
    default:
      return 'slate';
  }
}
