import * as Tabs from '@radix-ui/react-tabs';
import * as React from 'react';
import { clsx } from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import { nicenames } from '../app/caniemail-data';
import type { Insight } from '../actions/get-insights-for-email';
import { getInsightsForEmail } from '../actions/get-insights-for-email';
import { IconArrowDown } from './icons/icon-arrow-down';
import { EmailInsight } from './email-insight';

export type EmailClient =
  | 'gmail'
  | 'outlook'
  | 'yahoo'
  | 'apple-mail'
  | 'aol'
  | 'thunderbird'
  | 'microsoft'
  | 'samsung-email'
  | 'sfr'
  | 'orange'
  | 'protonmail'
  | 'hey'
  | 'mail-ru'
  | 'fastmail'
  | 'laposte'
  | 't-online-de'
  | 'free-fr'
  | 'gmx'
  | 'web-de'
  | 'ionos-1and1'
  | 'rainloop'
  | 'wp-pl';

export type Platform =
  | 'desktop-app'
  | 'desktop-webmail'
  | 'mobile-webmail'
  | 'webmail'
  | 'ios'
  | 'android'
  | 'windows'
  | 'macos'
  | 'windows-mail'
  | 'outlook-com';

export type SupportEntryCategroy = 'html' | 'css' | 'image' | 'others';

export interface SupportEntry {
  slug: string;
  title: string;
  description: string | null;
  url: string;
  category: SupportEntryCategroy;
  tags: string[];
  keywords: string | null;
  last_test_date: string;
  test_url: string;
  test_results_url: string | null;
  stats: Partial<
    Record<
      EmailClient,
      Partial<
        Record<
          Platform,
          /*
            This last Record<string, string> has only one key, as the
            ordered version of caniemail's data is meant to be something like:
           
            [
              { "1.0": "u" },
              { "2.0": "y" },
              { "3.0": "p #1" },
            ]
           
            So only one key for each object inside of this array, TypeScript can't really
            describe this though AFAIK.
          */
          Record</* version */ string, string>[]
        >
      >
    >
  >;
  notes: string | null;
  notes_by_num: Record<number, string> | null;
}

export const EmailInsights = ({
  code,
  pathToFile,
}: {
  code: string;
  pathToFile: string;
}) => {
  const emailClientsOfInterest: EmailClient[] = [
    'apple-mail',
    'gmail',
    'hey',
    'outlook',
    'yahoo',
  ];
  const [selectedEmailClient, setSelectedEmailClient] =
    React.useState<EmailClient>('apple-mail');

  React.useEffect(() => {
    const storedValue = localStorage.getItem('selected-email-client');
    if (
      storedValue &&
      (emailClientsOfInterest as string[]).includes(storedValue)
    ) {
      setSelectedEmailClient(storedValue as EmailClient);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <motion.div
      animate={{
        width: isExpanded ? '100%' : '10rem',
        height: isExpanded ? '24rem' : '2.5rem',
        position: isExpanded ? 'static' : 'fixed',
        left: isExpanded ? undefined : 0,
        bottom: isExpanded ? undefined : 0,
      }}
      className={clsx(
        'border-t flex-shrink border-slate-6 box-border bg-black',
        isExpanded && 'py-4',
      )}
      transition={{
        type: 'spring',
        bounce: 0.18,
        duration: 0.6,
      }}
    >
      <AnimatePresence>
        {!isExpanded ? (
          <motion.button
            className="bg-black flex items-center justify-center gap-1 w-[10rem] h-[2.5rem] transition-colors text-slate-11 hover:text-slate-12 text-xs font-semibold"
            key="expand-button"
            onClick={() => {
              setIsExpanded(true);
            }}
            type="button"
          >
            Compatibility insights
            <IconArrowDown className="origin-center rotate-180" />
          </motion.button>
        ) : null}
        {isExpanded ? (
          <motion.div
            animate={{ opacity: 1, display: 'block' }}
            className="h-full"
            exit={{ opacity: 0.2, display: 'none' }}
            initial={{ opacity: 0.2, display: 'none' }}
            key="expanded-insights"
            transition={{
              type: 'spring',
              bounce: 0.18,
              duration: 0.6,
            }}
          >
            <Tabs.Root
              className="space-y-4 h-full flex flex-col"
              onValueChange={(v) => {
                setSelectedEmailClient(v as EmailClient);
                localStorage.setItem('selected-email-client', v);
              }}
              value={selectedEmailClient}
            >
              <div className="px-4 pb-3 border-b border-slate-6 flex justify-between items-center">
                <button
                  className="bg-black flex items-center w-fit transition-colors text-slate-11 hover:text-slate-12 text-xs font-semibold"
                  onClick={() => {
                    setIsExpanded(false);
                  }}
                  type="button"
                >
                  Compatibility insights <IconArrowDown />
                </button>
                <Tabs.List
                  aria-label="Diagnostics available per email client"
                  className="space-x-4"
                >
                  {emailClientsOfInterest.map((emailClient) => (
                    <Tabs.Trigger
                      className={clsx(
                        'px-2 py-1 text-sm rounded-md relative',
                        emailClient === selectedEmailClient && 'text-slate-12',
                        emailClient !== selectedEmailClient && 'text-slate-11',
                      )}
                      key={emailClient}
                      value={emailClient}
                    >
                      {emailClient === selectedEmailClient && (
                        <motion.span
                          className="pointer-events-none absolute inset-0 z-[2] rounded-md bg-slate-6 border border-slate-6 group-focus:outline-none group-focus:ring group-focus:ring-slate-3"
                          initial={false}
                          layoutId="caniemail-diagnostic-tab-bubble"
                          transition={{
                            type: 'spring',
                            bounce: 0.18,
                            duration: 0.6,
                          }}
                        />
                      )}
                      {nicenames.family[emailClient]}
                    </Tabs.Trigger>
                  ))}
                </Tabs.List>
              </div>
              <div className="px-4 overflow-y-auto flex-grow">
                {emailClientsOfInterest.map((emailClient) => (
                  <Tabs.Content
                    className="grid grid-cols-4 gap-2"
                    value={emailClient}
                  >
                    <EmailClientInsightsTab
                      emailClient={emailClient}
                      key={emailClient}
                      pathToFile={pathToFile}
                      reactCode={code}
                    />
                  </Tabs.Content>
                ))}
              </div>
            </Tabs.Root>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
};

const EmailClientInsightsTab = ({
  pathToFile,
  emailClient,
  reactCode,
}: {
  pathToFile: string;
  reactCode: string;
  emailClient: EmailClient;
}) => {
  const [insights, setInsights] = React.useState<Insight[]>([]);

  React.useEffect(() => {
    getInsightsForEmail(reactCode, emailClient)
      .then(setInsights)
      .catch((exception) => {
        if (exception instanceof Error) {
          toast.error(exception.message);
        } else {
          toast.error(
            'Could not get the insights for the email, check your console!',
          );
          console.error(exception);
        }
      });
  }, [reactCode, emailClient]);

  return insights.map((insight) => (
    <EmailInsight
      emailClient={emailClient}
      insight={insight}
      key={insight.entry.slug}
      pathToFile={pathToFile}
    />
  ));
};
