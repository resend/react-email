import { cn } from '../../utils';

interface OutlookFrameProps {
  children: React.ReactNode;
  className?: string;
  viewport?: 'mobile' | 'desktop';
  subject?: string;
}

export const OutlookFrame = ({
  children,
  className,
  viewport = 'desktop',
  subject = 'Welcome to Our Newsletter',
}: OutlookFrameProps) => {
  const isMobile = viewport === 'mobile';

  if (isMobile) {
    return (
      <div
        className={cn(
          'bg-white rounded-lg shadow-lg overflow-hidden flex flex-col max-w-sm mx-auto',
          className,
        )}
      >
        {/* Outlook Header */}
        <div className="bg-blue-600 text-white px-4 py-3 border-b border-blue-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button type="button" className="p-1 hover:bg-blue-700 rounded">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <div className="text-lg font-semibold">Outlook</div>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" className="p-2 hover:bg-blue-700 rounded">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
              <button type="button" className="p-2 hover:bg-blue-700 rounded">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 12h.01M12 12h.01M19 12h.01"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Email Subject and Actions */}
        <div className="px-4 py-3 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-lg font-medium text-gray-900">{subject}</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-medium">
              Important
            </span>
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
              Inbox
            </span>
          </div>
        </div>

        {/* Sender Info */}
        <div className="px-4 py-3 border-b border-gray-200 bg-white">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                'bg-purple-500 rounded-full flex items-center justify-center text-white font-medium',
                'w-8 h-8 text-xs',
              )}
            >
              NL
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col gap-1">
                <div className="min-w-0">
                  <div className="font-medium text-gray-900 truncate text-sm">
                    Newsletter Team
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    newsletter@company.com
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    To: you@example.com
                  </div>
                </div>
                <div className="text-xs text-gray-500 whitespace-nowrap">
                  2:34 PM
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons (Mobile) */}
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-2">
          <div className="flex gap-2 justify-center">
            <button
              type="button"
              className="flex-1 text-xs bg-blue-600 text-white rounded py-2 hover:bg-blue-700"
            >
              Reply
            </button>
            <button
              type="button"
              className="flex-1 text-xs text-gray-700 border border-gray-300 rounded py-2 hover:bg-gray-50"
            >
              Forward
            </button>
          </div>
        </div>

        {/* Email Content Wrapper */}
        <div className="flex-1 bg-white overflow-hidden">
          <div className="w-full h-full">{children}</div>
        </div>
      </div>
    );
  }

  // Desktop view with sidebar
  return (
    <div
      className={cn(
        'bg-white rounded-lg shadow-lg overflow-hidden flex h-full',
        className,
      )}
    >
      {/* Outlook Sidebar */}
      <div className="w-64 bg-gray-100 border-r border-gray-300 flex flex-col">
        {/* Outlook Header */}
        <div className="bg-blue-600 text-white px-4 py-3">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 2h10c1.1 0 2 .9 2 2v16c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2zm5 2c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z" />
            </svg>
            <span className="text-lg font-semibold">Outlook</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-3">
          <div className="space-y-1">
            <div className="flex items-center gap-3 px-3 py-2 text-sm text-white bg-blue-600 rounded">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <span>Inbox</span>
              <span className="ml-auto text-xs bg-white text-blue-600 px-1 rounded">
                1
              </span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
              <span>Sent Items</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>Drafts</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              <span>Deleted Items</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                />
              </svg>
              <span>Archive</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>Junk Email</span>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="p-3 border-t border-gray-300">
          <button
            type="button"
            className="w-full bg-blue-600 text-white rounded px-4 py-2 text-sm font-medium hover:bg-blue-700"
          >
            New message
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Outlook Toolbar */}
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="p-1 hover:bg-gray-200 rounded text-gray-600"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
              <button
                type="button"
                className="p-1 hover:bg-gray-200 rounded text-gray-600"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 12h.01M12 12h.01M19 12h.01"
                  />
                </svg>
              </button>
            </div>
            <div className="text-sm text-gray-600">1 message</div>
          </div>
        </div>

        {/* Email Subject and Actions */}
        <div className="px-4 py-3 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl font-medium text-gray-900">{subject}</h1>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="p-1 hover:bg-gray-200 rounded text-gray-600"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
              <button
                type="button"
                className="p-1 hover:bg-gray-200 rounded text-gray-600"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 12h.01M12 12h.01M19 12h.01"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-medium">
              Important
            </span>
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
              Inbox
            </span>
          </div>
        </div>

        {/* Sender Info */}
        <div className="px-4 py-3 border-b border-gray-200 bg-white">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                'bg-purple-500 rounded-full flex items-center justify-center text-white font-medium',
                'w-10 h-10 text-sm',
              )}
            >
              NL
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-row items-start justify-between">
                <div className="min-w-0">
                  <div className="font-medium text-gray-900 truncate text-sm">
                    Newsletter Team
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    newsletter@company.com
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    To: you@example.com
                  </div>
                </div>
                <div className="text-xs text-gray-500 whitespace-nowrap">
                  Today at 2:34 PM
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Email Content Wrapper */}
        <div className="flex-1 bg-white overflow-hidden">
          <div className="w-full h-full">{children}</div>
        </div>

        {/* Desktop Action Bar */}
        <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                />
              </svg>
              Reply
            </button>
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              Forward
            </button>
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
            >
              Reply All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
