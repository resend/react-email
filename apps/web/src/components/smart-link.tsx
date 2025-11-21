import Link from 'next/link';
import type { ComponentProps } from 'react';

const EXTERNAL_REWRITE_PATHS = ['/docs'];

type SmartLinkProps = ComponentProps<typeof Link>;


/**
 * We'll temporarily use <a> to redirect to external domains -- apparently Next.js 16 has a router regression
 * where <Link> components try to do client-side navigation for rewritten paths (e.g., /docs -> mintlify.com)
 * The router doesn't detect these are external rewrites and attempts to fetch RSC payloads by adding
 * ?_rsc= query params (since the external domain doesn't serve RSC payloads, navigation fails)
 *
 * Context:
 * https://resend.slack.com/archives/C05R55V6GBF/p1763739968845719?thread_ts=1763732012.356639&cid=C05R55V6GBF
 */
export function SmartLink({ href, ...props }: SmartLinkProps) {
  const isExternalRewrite =
    typeof href === 'string' &&
    EXTERNAL_REWRITE_PATHS.some((path) => href.startsWith(path));

  if (isExternalRewrite) {
    return <a href={href} {...(props as ComponentProps<'a'>)} />;
  }

  return <Link href={href} {...props} />;
}
