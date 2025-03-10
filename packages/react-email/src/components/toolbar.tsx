import { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
// import { ImageChecker } from './image-checker';
// import { LinkChecker } from './link-checker';
import { SpamAssassin } from './toolbar/spam-assassin';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { cn } from '../utils';

type ToolbarProps = React.ComponentProps<'div'> & {
  emailSlug: string;
  markup: string;
  plainText: string;
};

type ActivePanelValue = 'linter' | 'spam-assassin';

export const Toolbar = ({
  emailSlug,
  markup,
  plainText,
  className,
  ...rest
}: ToolbarProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [toggled, setToggled] = useState(true);

  const activePanelValue = (searchParams.get('toolbar-panel') ??
    'linter') as ActivePanelValue;

  const setActivePanelValue = (newValue: ActivePanelValue) => {
    const params = new URLSearchParams(searchParams);
    params.set('sidebar-panel', newValue);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div {...rest} className={cn('bg-black text-xs text-slate-11 h-40', className)}>
      <div className="flex justify-between">
        <Tabs.Root
          value={activePanelValue}
          onValueChange={(v) => setActivePanelValue(v as ActivePanelValue)}
        >
          <Tabs.List className="flex gap-5">
            <Tabs.Trigger value="linter">Linter</Tabs.Trigger>
            <Tabs.Trigger value="Spam Assassin">Spam Assassin</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="linter">Linter</Tabs.Content>
          <Tabs.Content value="spam-assassin">
            <SpamAssassin
              emailMarkup={markup}
              emailPlainText={plainText}
              emailSlug={emailSlug}
            />
          </Tabs.Content>
        </Tabs.Root>

        <div>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10.52 6C10.52 3.73168 8.75221 1.48 6.00006 1.48C3.77741 1.48 2.67886 3.1251 2.21074 3.99999H3.60005C3.82096 3.99999 4.00005 4.17908 4.00005 4.39999C4.00005 4.6209 3.82096 4.79999 3.60005 4.79999H1.20005C0.979137 4.79999 0.800049 4.6209 0.800049 4.39999V1.99999C0.800049 1.77908 0.979137 1.59999 1.20005 1.59999C1.42096 1.59999 1.60005 1.77908 1.60005 1.99999V3.45056C2.16367 2.45702 3.4673 0.679993 6.00006 0.679993C9.25029 0.679993 11.32 3.34831 11.32 6C11.32 8.65169 9.25029 11.32 6.00006 11.32C4.44499 11.32 3.15027 10.7047 2.22843 9.76673C1.73486 9.26449 1.34939 8.67121 1.08658 8.03257C1.0025 7.8283 1.09995 7.59453 1.30424 7.51046C1.50853 7.42638 1.7423 7.52384 1.82637 7.72812C2.05104 8.27401 2.38001 8.77961 2.79901 9.20593C3.57646 9.99705 4.66802 10.52 6.00006 10.52C8.75221 10.52 10.52 8.26833 10.52 6Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
