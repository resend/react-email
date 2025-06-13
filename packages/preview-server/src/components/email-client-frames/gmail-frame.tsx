import { cn } from '../../utils';

interface GmailFrameProps {
  children: React.ReactNode;
  className?: string;
  viewport?: 'mobile' | 'desktop';
  subject?: string;
}

export const GmailFrame = ({
  children,
  className,
  viewport = 'desktop',
  subject = 'Welcome to Our Newsletter',
}: GmailFrameProps) => {
  const isMobile = viewport === 'mobile';

  if (isMobile) {
    return (
      <div
        className={cn(
          'bg-white rounded-lg shadow-lg overflow-hidden flex flex-col max-w-sm mx-auto',
          className,
        )}
      >
        {/* Gmail Header */}
        <div className="border-b border-gray-200 px-4 py-3 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
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
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
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
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </button>
              <button
                type="button"
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
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

        {/* Email Subject and Labels */}
        <div className="px-6 py-4 border-b border-gray-100 bg-white">
          <h1 className="font-normal mb-2 text-xl text-gray-900">{subject}</h1>
          <div className="flex items-center gap-2">
            <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded font-medium">
              External
            </span>
            <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
              Inbox
            </span>
          </div>
        </div>

        {/* Sender Info */}
        <div className="px-6 py-4 border-b border-gray-100 bg-white">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                'rounded-full flex items-center justify-center text-white font-medium bg-gray-600',
                'w-8 h-8 text-xs',
              )}
            >
              NL
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col gap-1">
                <div className="min-w-0">
                  <div className="font-medium truncate text-sm text-gray-900">
                    Newsletter Team
                  </div>
                  <div className="text-xs mt-1 text-gray-600">to me</div>
                </div>
                <div className="text-xs whitespace-nowrap flex items-center gap-2 text-gray-500">
                  <span>May 30</span>
                  <button
                    type="button"
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <svg
                      className="w-4 h-4 text-gray-600"
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
                  </button>
                  <button
                    type="button"
                    className="p-1 rounded hover:bg-gray-100"
                  >
                    <svg
                      className="w-4 h-4 text-gray-600"
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
              <div className="text-xs text-gray-500 truncate mt-1">
                newsletter@company.com
              </div>
            </div>
          </div>
        </div>

        {/* Email Content Area */}
        <div className="flex-1 overflow-hidden bg-white">
          <div className="w-full h-full">{children}</div>
        </div>

        {/* Reply/Forward Actions */}
        <div className="border-t px-6 py-4 bg-white border-gray-100">
          <div className="flex gap-3 flex-row justify-center">
            <button
              type="button"
              className="flex items-center justify-center gap-2 text-sm border rounded-full px-4 py-2 text-gray-700 border-gray-300 hover:bg-gray-50"
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
              className="flex items-center justify-center gap-2 text-sm border rounded-full px-4 py-2 text-gray-700 border-gray-300 hover:bg-gray-50"
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
          </div>
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
      {/* Gmail Sidebar */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
        {/* Gmail Logo and Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <svg
              className="w-6 h-6 text-red-500"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h.677l9.687 7.273 9.687-7.273h.677A1.636 1.636 0 0 1 24 5.457z" />
            </svg>
            <span className="text-xl text-gray-700 font-normal">Gmail</span>
          </div>
          <button
            type="button"
            className="w-full bg-white border border-gray-300 rounded-full px-4 py-2 text-left text-gray-500 text-sm hover:shadow-sm"
          >
            Search mail
          </button>
        </div>

        {/* Compose Button */}
        <div className="p-4">
          <button
            type="button"
            className="w-full bg-blue-600 text-white rounded-full px-6 py-3 text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Compose
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-2">
          <div className="space-y-1">
            <div className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 bg-red-100 rounded-r-full">
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
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <span>Inbox</span>
              <span className="ml-auto text-xs font-medium">1</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-r-full">
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
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
              <span>Starred</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-r-full">
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Snoozed</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-r-full">
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
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
              <span>Sent</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-r-full">
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>Drafts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Gmail Header */}
        <div className="border-b border-gray-200 px-4 py-3 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
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
              <button
                type="button"
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
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
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
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
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">2 of 2</span>
              <button
                type="button"
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
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
              <button
                type="button"
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
              <button
                type="button"
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
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

        {/* Email Subject and Labels */}
        <div className="px-6 py-4 border-b border-gray-100 bg-white">
          <h1 className="font-normal mb-2 text-xl text-gray-900">{subject}</h1>
          <div className="flex items-center gap-2">
            <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded font-medium">
              External
            </span>
            <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
              Inbox
            </span>
          </div>
        </div>

        {/* Sender Info */}
        <div className="px-6 py-4 border-b border-gray-100 bg-white">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                'rounded-full flex items-center justify-center text-white font-medium bg-gray-600',
                'w-10 h-10 text-sm',
              )}
            >
              NL
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-row items-start justify-between">
                <div className="min-w-0">
                  <div className="font-medium truncate text-sm text-gray-900">
                    Newsletter Team
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    &lt;newsletter@company.com&gt;
                  </div>
                  <div className="text-xs mt-1 text-gray-600">to me</div>
                </div>
                <div className="text-xs whitespace-nowrap flex items-center gap-2 text-gray-500">
                  <span>Fri, May 30, 11:22 AM (13 days ago)</span>
                  <button
                    type="button"
                    className="p-1 rounded hover:bg-gray-100"
                  >
                    <svg
                      className="w-4 h-4 text-gray-600"
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
          </div>
        </div>

        {/* Email Content Area */}
        <div className="flex-1 overflow-hidden bg-white">
          <div className="w-full h-full">{children}</div>
        </div>

        {/* Reply/Forward Actions */}
        <div className="border-t px-6 py-4 bg-white border-gray-100">
          <div className="flex gap-3 flex-row items-center">
            <button
              type="button"
              className="flex items-center justify-center gap-2 text-sm border rounded-full px-4 py-2 text-gray-700 border-gray-300 hover:bg-gray-50"
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
              className="flex items-center justify-center gap-2 text-sm border rounded-full px-4 py-2 text-gray-700 border-gray-300 hover:bg-gray-50"
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
          </div>
        </div>
      </div>
    </div>
  );
};
