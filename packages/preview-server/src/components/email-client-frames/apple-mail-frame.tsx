import { cn } from '../../utils';

interface AppleMailFrameProps {
  children: React.ReactNode;
  className?: string;
  viewport?: 'mobile' | 'desktop';
  subject?: string;
}

export const AppleMailFrame = ({
  children,
  className,
  viewport = 'desktop',
  subject = 'Welcome to Our Newsletter',
}: AppleMailFrameProps) => {
  const isMobile = viewport === 'mobile';

  if (isMobile) {
    return (
      <div
        className={cn(
          'bg-white rounded-lg shadow-lg overflow-hidden flex flex-col max-w-sm mx-auto',
          className,
        )}
      >
        {/* Mobile Status Bar */}
        <div className="bg-black px-4 py-2 flex items-center justify-between text-white text-sm">
          <div className="flex items-center gap-1">
            <span className="font-medium">9:08</span>
            <svg
              className="w-4 h-4 ml-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <div className="flex items-center gap-1">
            <div className="flex gap-1">
              <div className="w-1 h-3 bg-white rounded-full opacity-60" />
              <div className="w-1 h-3 bg-white rounded-full opacity-80" />
              <div className="w-1 h-3 bg-white rounded-full" />
              <div className="w-1 h-3 bg-white rounded-full" />
            </div>
            <svg
              className="w-4 h-4 ml-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M2 17h20v2H2zm1.15-4.05L4 11.47l.85 1.48L5.5 12l-.65-1.05zM7.5 12l.85 1.48L9.2 12l-.85-1.48L7.5 12zm4.5 0l.85 1.48L13.7 12l-.85-1.48L12 12zm4.5 0l.85 1.48L18.2 12l-.85-1.48L16.5 12zm4.5 0l.85 1.48L22.7 12l-.85-1.48L21 12z" />
            </svg>
            <div className="bg-white text-black px-1 rounded text-xs font-medium ml-1">
              92
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200">
          <button
            type="button"
            className="text-blue-500 flex items-center gap-2"
          >
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
            <span className="text-sm">Inbox</span>
          </button>
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
                  d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Email Header */}
        <div className="bg-white px-4 py-4 border-b border-gray-200">
          <h1 className="text-gray-900 text-lg font-medium leading-tight mb-3">
            {subject}
          </h1>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
              NL
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-gray-900 font-medium text-sm">
                  Newsletter Team
                </span>
                <span className="text-gray-500 text-xs">2:34 PM</span>
              </div>
              <p className="text-gray-500 text-xs mt-1">
                newsletter@company.com
              </p>
              <p className="text-gray-500 text-xs">To: you@example.com</p>
            </div>
          </div>
        </div>

        {/* Email Content */}
        <div className="flex-1 bg-white overflow-hidden">
          <div className="w-full h-full min-h-[400px]">{children}</div>
        </div>

        {/* Mobile Bottom Actions */}
        <div className="bg-gray-50 border-t border-gray-200 px-4 py-3">
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              className="flex items-center gap-2 text-blue-500 text-sm"
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
              className="flex items-center gap-2 text-gray-600 text-sm"
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

  // Desktop view
  return (
    <div
      className={cn(
        'bg-gray-100 rounded-lg shadow-lg overflow-hidden flex h-full',
        className,
      )}
    >
      {/* Sidebar */}
      <div className="w-80 bg-gray-200 border-r border-gray-300 flex flex-col">
        {/* Sidebar Header */}
        <div className="bg-gray-300 px-4 py-2 border-b border-gray-400">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <div className="w-3 h-3 bg-yellow-500 rounded-full" />
              <div className="w-3 h-3 bg-green-500 rounded-full" />
            </div>
            <span className="text-gray-700 font-medium text-sm ml-2">
              Inbox (Read Only)
            </span>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 p-4">
          <div className="space-y-2">
            <div className="text-gray-600 text-sm font-medium mb-3">
              Favorites
            </div>
            <div className="flex items-center gap-2 text-blue-600 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
              </svg>
              Inbox
            </div>
            <div className="text-gray-600 text-sm">VIPs</div>
            <div className="text-gray-600 text-sm">Sent</div>

            <div className="text-gray-600 text-sm font-medium mt-6 mb-3">
              Smart Mailboxes
            </div>
            <div className="text-gray-600 text-sm">Inbox</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Toolbar */}
        <div className="bg-gray-100 border-b border-gray-300 px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="text-gray-600 text-sm">1 message</div>
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Email Header */}
        <div className="bg-white px-6 py-4 border-b border-gray-200">
          <h1 className="text-gray-900 text-xl font-medium mb-3">{subject}</h1>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              NL
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-gray-900 font-medium text-sm">
                    Newsletter Team
                  </div>
                  <div className="text-gray-500 text-xs">
                    newsletter@company.com
                  </div>
                </div>
                <div className="text-gray-500 text-xs">Today at 2:34 PM</div>
              </div>
              <div className="text-gray-500 text-xs mt-1">
                To: you@example.com
              </div>
            </div>
          </div>
        </div>

        {/* Email Content */}
        <div className="flex-1 overflow-hidden">
          <div className="w-full h-full">{children}</div>
        </div>
      </div>
    </div>
  );
};
