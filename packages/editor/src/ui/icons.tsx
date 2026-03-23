import type * as React from 'react';

interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  size?: number | string;
}

function icon(name: string, paths: React.ReactNode) {
  function Icon({ size, width, height, ...props }: IconProps) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size ?? width ?? 24}
        height={size ?? height ?? 24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...props}
      >
        {paths}
      </svg>
    );
  }
  Icon.displayName = name;
  return Icon;
}

export const AlignCenterIcon = icon(
  'AlignCenterIcon',
  <>
    <path d="M21 5H3" />
    <path d="M17 12H7" />
    <path d="M19 19H5" />
  </>,
);

export const AlignLeftIcon = icon(
  'AlignLeftIcon',
  <>
    <path d="M21 5H3" />
    <path d="M15 12H3" />
    <path d="M17 19H3" />
  </>,
);

export const AlignRightIcon = icon(
  'AlignRightIcon',
  <>
    <path d="M21 5H3" />
    <path d="M21 12H9" />
    <path d="M21 19H7" />
  </>,
);

export const BoldIcon = icon(
  'BoldIcon',
  <path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8" />,
);

export const CaseUpperIcon = icon(
  'CaseUpperIcon',
  <>
    <path d="M15 11h4.5a1 1 0 0 1 0 5h-4a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h3a1 1 0 0 1 0 5" />
    <path d="m2 16 4.039-9.69a.5.5 0 0 1 .923 0L11 16" />
    <path d="M3.304 13h6.392" />
  </>,
);

export const Check = icon('Check', <path d="M20 6 9 17l-5-5" />);

export const ChevronDown = icon('ChevronDown', <path d="m6 9 6 6 6-6" />);

export const CodeIcon = icon(
  'CodeIcon',
  <>
    <path d="m16 18 6-6-6-6" />
    <path d="m8 6-6 6 6 6" />
  </>,
);
export const Code = CodeIcon;

export const Columns2 = icon(
  'Columns2',
  <>
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M12 3v18" />
  </>,
);

export const Columns3 = icon(
  'Columns3',
  <>
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M9 3v18" />
    <path d="M15 3v18" />
  </>,
);

export const Columns4 = icon(
  'Columns4',
  <>
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M7.5 3v18" />
    <path d="M12 3v18" />
    <path d="M16.5 3v18" />
  </>,
);

export const ExternalLinkIcon = icon(
  'ExternalLinkIcon',
  <>
    <path d="M15 3h6v6" />
    <path d="M10 14 21 3" />
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </>,
);

export const Heading1 = icon(
  'Heading1',
  <>
    <path d="M4 12h8" />
    <path d="M4 18V6" />
    <path d="M12 18V6" />
    <path d="m17 12 3-2v8" />
  </>,
);

export const Heading2 = icon(
  'Heading2',
  <>
    <path d="M4 12h8" />
    <path d="M4 18V6" />
    <path d="M12 18V6" />
    <path d="M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1" />
  </>,
);

export const Heading3 = icon(
  'Heading3',
  <>
    <path d="M4 12h8" />
    <path d="M4 18V6" />
    <path d="M12 18V6" />
    <path d="M17.5 10.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2" />
    <path d="M17 17.5c2 1.5 4 .3 4-1.5a2 2 0 0 0-2-2" />
  </>,
);

export const ItalicIcon = icon(
  'ItalicIcon',
  <>
    <line x1="19" x2="10" y1="4" y2="4" />
    <line x1="14" x2="5" y1="20" y2="20" />
    <line x1="15" x2="9" y1="4" y2="20" />
  </>,
);

export const LinkIcon = icon(
  'LinkIcon',
  <>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </>,
);

export const List = icon(
  'List',
  <>
    <path d="M3 5h.01" />
    <path d="M3 12h.01" />
    <path d="M3 19h.01" />
    <path d="M8 5h13" />
    <path d="M8 12h13" />
    <path d="M8 19h13" />
  </>,
);

export const ListOrdered = icon(
  'ListOrdered',
  <>
    <path d="M11 5h10" />
    <path d="M11 12h10" />
    <path d="M11 19h10" />
    <path d="M4 4h1v5" />
    <path d="M4 9h2" />
    <path d="M6.5 20H3.4c0-1 2.6-1.925 2.6-3.5a1.5 1.5 0 0 0-2.6-1.02" />
  </>,
);

export const MousePointer = icon(
  'MousePointer',
  <>
    <path d="M12.586 12.586 19 19" />
    <path d="M3.688 3.037a.497.497 0 0 0-.651.651l6.5 15.999a.501.501 0 0 0 .947-.062l1.569-6.083a2 2 0 0 1 1.448-1.479l6.124-1.579a.5.5 0 0 0 .063-.947z" />
  </>,
);

export const PencilIcon = icon(
  'PencilIcon',
  <>
    <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
    <path d="m15 5 4 4" />
  </>,
);

export const Rows2 = icon(
  'Rows2',
  <>
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M3 12h18" />
  </>,
);

export const SplitSquareVertical = icon(
  'SplitSquareVertical',
  <>
    <path d="M5 8V5c0-1 1-2 2-2h10c1 0 2 1 2 2v3" />
    <path d="M19 16v3c0 1-1 2-2 2H7c-1 0-2-1-2-2v-3" />
    <line x1="4" x2="20" y1="12" y2="12" />
  </>,
);

export const SquareCode = icon(
  'SquareCode',
  <>
    <path d="m10 9-3 3 3 3" />
    <path d="m14 15 3-3-3-3" />
    <rect x="3" y="3" width="18" height="18" rx="2" />
  </>,
);

export const StrikethroughIcon = icon(
  'StrikethroughIcon',
  <>
    <path d="M16 4H9a3 3 0 0 0-2.83 4" />
    <path d="M14 12a4 4 0 0 1 0 8H6" />
    <line x1="4" x2="20" y1="12" y2="12" />
  </>,
);

export const TextIcon = icon(
  'TextIcon',
  <>
    <path d="M21 5H3" />
    <path d="M15 12H3" />
    <path d="M17 19H3" />
  </>,
);
export const Text = TextIcon;

export const TextQuote = icon(
  'TextQuote',
  <>
    <path d="M17 5H3" />
    <path d="M21 12H8" />
    <path d="M21 19H8" />
    <path d="M3 12v7" />
  </>,
);

export const UnderlineIcon = icon(
  'UnderlineIcon',
  <>
    <path d="M6 4v6a6 6 0 0 0 12 0V4" />
    <line x1="4" x2="20" y1="20" y2="20" />
  </>,
);

export const UnlinkIcon = icon(
  'UnlinkIcon',
  <>
    <path d="m18.84 12.25 1.72-1.71h-.02a5.004 5.004 0 0 0-.12-7.07 5.006 5.006 0 0 0-6.95 0l-1.72 1.71" />
    <path d="m5.17 11.75-1.71 1.71a5.004 5.004 0 0 0 .12 7.07 5.006 5.006 0 0 0 6.95 0l1.71-1.71" />
    <line x1="8" x2="8" y1="2" y2="5" />
    <line x1="2" x2="5" y1="8" y2="8" />
    <line x1="16" x2="16" y1="19" y2="22" />
    <line x1="19" x2="22" y1="16" y2="16" />
  </>,
);
