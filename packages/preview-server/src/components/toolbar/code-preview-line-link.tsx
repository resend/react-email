import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface CodePreviewLineLinkProps {
  line: number;
  column: number;

  type: 'react' | 'html';
}

export const CodePreviewLineLink = ({
  line,
  type,
}: CodePreviewLineLinkProps) => {
  const searchParams = useSearchParams();

  const newSearchParams = new URLSearchParams(searchParams);
  newSearchParams.set('view', 'source');
  if (type === 'html') {
    newSearchParams.set('lang', 'markup');
  } else if (type === 'react') {
    newSearchParams.set('lang', 'jsx');
  }

  const fragmentIdentifier = `#L${line}`;

  return (
    <Link
      href={{
        search: newSearchParams.toString(),
        hash: fragmentIdentifier,
      }}
      scroll={false}
      className="appearance-none underline mx-2"
    >
      L{line.toString().padStart(2, '0')}
    </Link>
  );
};
