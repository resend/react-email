import {
  type IllustrationTone,
  illustrationSurfaceByTone,
} from './illustration-shared';

export function IllustrationPlaceholder({
  tone = 'slate',
}: {
  tone?: IllustrationTone;
}) {
  return (
    <div
      aria-hidden
      className={`relative h-14 w-[70%] max-w-44 rounded-md border ${illustrationSurfaceByTone[tone].outer}`}
    >
      <div
        className={`absolute inset-2 rounded-xs border ${illustrationSurfaceByTone[tone].inner}`}
      />
    </div>
  );
}
