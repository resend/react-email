import {
  type IllustrationTone,
  illustrationSurfaceByTone,
} from './illustration-shared';

const Illustration = ({ tone = 'slate' }: { tone?: IllustrationTone }) => (
  <div
    aria-hidden
    className={`relative h-14 w-[70%] max-w-44 rounded-md border ${illustrationSurfaceByTone[tone].outer}`}
  >
    <div
      className={`absolute inset-2 rounded-xs border ${illustrationSurfaceByTone[tone].inner}`}
    />
  </div>
);

export default Illustration;
