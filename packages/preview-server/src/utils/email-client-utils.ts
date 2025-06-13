import {
  AppleMailFrame,
  GmailFrame,
  OutlookFrame,
} from '../components/email-client-frames';

/**
 * Utility functions for processing emails in client frame simulations
 */

/**
 * Email client frame types
 */
export type ClientFrameComponent =
  | typeof GmailFrame
  | typeof OutlookFrame
  | typeof AppleMailFrame;

/**
 * Gets the appropriate client frame component based on the active client
 * Returns null if client is not enabled or no metadata is available
 */
export function getClientFrameComponent(
  clientEnabled: boolean,
  activeClient: string,
  hasRenderingMetadata: boolean,
): ClientFrameComponent | null {
  if (!clientEnabled || !hasRenderingMetadata) return null;

  switch (activeClient) {
    case 'gmail':
      return GmailFrame;
    case 'outlook':
      return OutlookFrame;
    case 'apple-mail':
      return AppleMailFrame;
    default:
      return null;
  }
}

/**
 * Strips viewport meta tags from HTML to simulate email client behavior
 * Most email clients remove or ignore viewport meta tags for security reasons
 */
export function stripViewportMetaTags(html: string): string {
  return html.replace(/<meta\s+name=["']viewport["'][^>]*>/gi, '');
}

/**
 * Makes email content responsive for client frames by stripping viewport meta tags
 * and injecting CSS that forces responsive behavior
 * This simulates how email clients handle responsive content
 * Only applies responsive CSS for mobile viewports
 */
export function makeEmailResponsive(
  html: string,
  viewport: 'mobile' | 'desktop' = 'desktop',
): string {
  // Always strip viewport meta tags for email client simulation
  let processedHtml = stripViewportMetaTags(html);

  // Only inject responsive CSS for mobile viewports
  if (viewport === 'mobile') {
    const responsiveCSS = `
      <style type="text/css">
        /* Force email content to be responsive in mobile client frames */
        body, table, td, div, p, span {
          max-width: 100% !important;
          box-sizing: border-box !important;
        }
        
        /* Override any fixed table widths */
        table {
          width: 100% !important;
          max-width: 100% !important;
          min-width: auto !important;
        }
        
        /* Prevent horizontal overflow */
        body {
          overflow-x: hidden !important;
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        
        /* Make images responsive */
        img {
          max-width: 100% !important;
          height: auto !important;
        }
        
        /* Force container elements to be responsive */
        .container, [class*="container"] {
          width: 100% !important;
          max-width: 100% !important;
        }
        
        /* Override any fixed widths in style attributes */
        [style*="width"] {
          width: 100% !important;
          max-width: 100% !important;
        }
      </style>
    `;

    // Insert the CSS right after the opening <head> tag or before </head>
    if (processedHtml.includes('<head>')) {
      processedHtml = processedHtml.replace('<head>', `<head>${responsiveCSS}`);
    } else if (processedHtml.includes('</head>')) {
      processedHtml = processedHtml.replace(
        '</head>',
        `${responsiveCSS}</head>`,
      );
    } else {
      // If no head tag, insert at the beginning of the HTML
      processedHtml = `${responsiveCSS}${processedHtml}`;
    }
  }

  return processedHtml;
}
