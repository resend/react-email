'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { motion } from 'framer-motion';
import * as React from 'react';
import { cn } from '../../utils';
import { tabTransition } from '../../utils/constants';
import { IconArrowDown } from '../icons/icon-arrow-down';

export interface EmailClient {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Email client configurations
export const EMAIL_CLIENTS: EmailClient[] = [
  {
    id: 'gmail',
    name: 'Gmail',
    icon: ({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h.677l9.687 7.273 9.687-7.273h.677A1.636 1.636 0 0 1 24 5.457z" />
      </svg>
    ),
  },
  {
    id: 'outlook',
    name: 'Outlook',
    icon: ({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.5 17.5c-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5 4.5 2 4.5 4.5-2 4.5-4.5 4.5z" />
      </svg>
    ),
  },
  {
    id: 'apple-mail',
    name: 'Apple Mail',
    icon: ({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z" />
      </svg>
    ),
  },
];

interface EmailClientToggleGroupProps {
  isEnabled: boolean;
  activeClient: string;
  subject: string;
  onToggle: (enabled: boolean) => void;
  onClientChange: (client: string) => void;
  onSubjectChange: (subject: string) => void;
}

const chevronVariant = {
  active: {
    width: '2.5rem',
    padding: '0 0.5rem',
  },
  inactive: {
    width: '0',
    padding: '0',
  },
};

export const EmailClientToggleGroup = ({
  isEnabled,
  activeClient,
  subject,
  onToggle,
  onClientChange,
  onSubjectChange,
}: EmailClientToggleGroupProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const handleButtonClick = () => {
    const newEnabled = !isEnabled;
    onToggle(newEnabled);

    // If enabling for the first time, default to Gmail
    if (newEnabled && (!activeClient || activeClient === '')) {
      onClientChange('gmail');
    }

    // Close dropdown when disabling
    if (!newEnabled) {
      setIsDropdownOpen(false);
    }
  };

  return (
    <div className="relative flex h-9 w-fit overflow-hidden rounded-lg border border-slate-6 text-sm transition-colors duration-300 ease-in-out focus-within:border-slate-8 hover:border-slate-8">
      {/* Main Button (handles enable/disable) */}
      <motion.button
        onClick={handleButtonClick}
        className={cn(
          'relative flex items-center justify-center p-2 transition ease-in-out duration-200 hover:text-slate-12',
          {
            'text-slate-11': !isEnabled,
            'text-slate-12': isEnabled,
          },
        )}
      >
        {/* Active background (like active-view-toggle-group) */}
        {isEnabled && (
          <motion.span
            animate={{ opacity: 1 }}
            className="absolute left-0 right-0 top-0 bottom-0 bg-slate-4"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            layoutId="email-client-active"
            transition={tabTransition}
          />
        )}

        {/* Icon and text */}
        <div className="relative flex items-center gap-2">
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
          <span className="hidden sm:inline text-xs uppercase">Client</span>
        </div>
      </motion.button>

      {/* Sliding Chevron (like view-size-controls) */}
      <DropdownMenu.Root open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenu.Trigger asChild>
          <motion.button
            initial={false}
            animate={isEnabled ? 'active' : 'inactive'}
            variants={chevronVariant}
            className="relative flex items-center justify-center overflow-hidden bg-slate-5 text-slate-11 text-sm leading-none outline-none transition-colors ease-linear focus-within:text-slate-12 hover:text-slate-12 focus:text-slate-12"
            disabled={!isEnabled}
            type="button"
          >
            <span className="sr-only">Select email client</span>
            <IconArrowDown
              className={cn(
                'transform transition-transform duration-200 ease-[cubic-bezier(.36,.66,.6,1)]',
                {
                  '-rotate-180': isDropdownOpen,
                },
              )}
            />
          </motion.button>
        </DropdownMenu.Trigger>

        {isEnabled && (
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              className="flex min-w-[16rem] flex-col gap-3 rounded-md border border-slate-8 border-solid bg-black px-3 py-3 text-white"
              sideOffset={5}
            >
              {/* Subject Input */}
              <div className="flex flex-col gap-2">
                <label
                  className="text-xs uppercase text-slate-10"
                  htmlFor="email-client-subject"
                >
                  Subject
                </label>
                <input
                  id="email-client-subject"
                  type="text"
                  value={subject}
                  onChange={(e) => onSubjectChange(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-slate-6 bg-slate-3 px-2 py-1 text-sm text-slate-12 placeholder-slate-10 outline-none transition duration-300 ease-in-out focus:ring-1 focus:ring-slate-10"
                  placeholder="Enter email subject..."
                />
              </div>

              {/* Separator */}
              <div className="h-px bg-slate-6" />

              {/* Email Client Options */}
              <div className="flex flex-col gap-1">
                {EMAIL_CLIENTS.map((client) => (
                  <DropdownMenu.Item
                    key={client.id}
                    className={cn(
                      'group flex w-full cursor-pointer select-none items-center justify-between rounded-md py-1.5 pr-1 pl-2 text-sm outline-none transition-colors data-[highlighted]:bg-slate-5',
                      client.id === activeClient && 'bg-slate-5',
                    )}
                    onSelect={() => onClientChange(client.id)}
                  >
                    <div className="flex items-center gap-2">
                      <client.icon className="w-4 h-4" />
                      <span>{client.name}</span>
                    </div>
                    {client.id === activeClient && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    )}
                  </DropdownMenu.Item>
                ))}
              </div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        )}
      </DropdownMenu.Root>
    </div>
  );
};
