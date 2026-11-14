# react-email

## What this codebase does

pnpm/Turborepo monorepo for React Email (TypeScript, React 19, Next.js 16).
It publishes npm packages that run on developers' machines and in their CI:
`react-email` (email components and the `email` CLI: `dev`, `build`, `start`,
`export`, `resend setup`), `@react-email/ui` (the Next.js preview server the
CLI boots), `@react-email/render`, `@react-email/editor` (TipTap editor that
serializes to email HTML) and `create-email`. `apps/web` is the public
react.email site on Vercel; its `/api/send/test` and `/api/check-spam` routes
back the preview server's "send test email" and "spam check" tools.
`apps/docs`, `apps/demo`, `examples/`, `playground/` and `benchmarks/` are
docs, samples and tooling.

## Auth shape

- There are no users, sessions, cookies or API tokens in this repo, so the
  controls below stand in for auth; a change that drops or bypasses one is
  the finding. For the preview and dev servers the question is who can reach
  them, not whether they have a login.
- `checkRateLimit('test-email-sending')` (`@vercel/firewall`), then
  `tryConsume` with `sendTestIpRatelimit` and `sendTestRecipientRatelimit`:
  the only gates on `/api/send/test`. Check what each does when its backend
  is unavailable.
- Path confinement: `isPathWithinEmailsDirectory` (realpath-based; every
  preview-server action taking a path or slug must call it, as
  `renderEmailByPath` and `getEmailPathFromSlug` do), `serveStaticFile` for
  `/static/*` on the CLI dev server, and `getUnsafeOutDirMessage` before the
  recursive delete in `email export`.
- The `sandbox` attribute on the preview iframe in `email-frame.tsx` (no
  `allow-scripts`) keeps template markup from scripting the preview origin.
- `sanitizePastedHtml` and `getUrlFromString` (`SAFE_PROTOCOLS`) are the
  editor's HTML and URL-scheme filters.

## Threat model

Highest impact is abuse of the hosted endpoints: `/api/send/test` mails
caller-supplied HTML to any address from `preview@react.email`, so weaker
limits make it a phishing relay that burns the sending domain, and
`/api/check-spam` frames caller text into a raw SPAMC request to an internal
spamd host. Next is anything other than the developer's own browser reaching
the preview server (another host on the network, a web page open in that
browser, a hosted `email build`): its Server Actions are plain POSTs that
read files, bundle and execute templates, fetch URLs, and call Resend with
the developer's stored API key. Then injection through the published
libraries, where applications pass end-user data into components or editor
content and the output is HTML mailed on their behalf. Last is release
integrity: packages are published from CI with npm provenance.

## Project-specific patterns to flag

- A Server Action in `packages/ui/src/actions` that passes a client-supplied
  path or slug to `fs`, esbuild or `runBundledCode` without
  `isPathWithinEmailsDirectory`, or that accepts an absolute path.
- Server-side requests to client-chosen URLs: `checkLinks` and `checkImages`
  pass every `href`/`src` in posted HTML to `quickFetch` and return the
  status code and body size. Check what limits the destination.
- Component props concatenated into raw HTML or CSS and emitted through
  `dangerouslySetInnerHTML`: `Font` (`fontFamily`, `webFont.url`), the
  `Markdown` renderer (`marked` output, inline `style` strings), `Tailwind`.
- Changes to `apps/web/src/app/api/send/test/route.ts` that widen what a
  caller controls (`from`, headers, attachments, recipient lists) or reorder
  or skip a limiter; any new POST route under `apps/web/src/app/api` without
  one. That file is production code: deepsec's default `**/test/**` ignore
  hides it, so read it whenever `rate-limiter.ts` is under review.
- HTML or URLs reaching the editor document or `composeReactEmail` output
  without `sanitizePastedHtml` / `getUrlFromString`, including pasted content
  that takes the sanitizer's `isFromEditor` branch.

## Known false-positives

- "Missing auth" on `/api/send/test` and `/api/check-spam`, and
  `Access-Control-Allow-Origin: *` in `apps/web/next.config.ts`. These are
  intentional: preview servers on developers' machines call them
  cross-origin and no credentials exist. Judge the abuse controls instead.
- Executing templates is the product: esbuild and `node:vm` in
  `getEmailComponent` / `runBundledCode`, `jiti` imports for
  `--esbuild-plugins`, `require` of built templates in `email export`. `vm`
  is not used as a sandbox. Only how the path is chosen matters.
- `encryptionKey` in `packages/react-email/src/cli/utils/conf.ts` is a
  documented obfuscation key for the `conf` store, not a secret.
  `Math.random` and `sha1` (`getWorkspaceId`) only build non-secret ids.
- Matcher noise: no DES, RC4 or Blowfish exists, so "weak cipher" hits are
  the words `description` and `design`; `export default function` in email
  templates and `page.tsx` files are React components, not request handlers.
- Sample and vendored content: `apps/demo/emails`, `playground/`,
  `examples/*` (provider samples reading keys from env), `benchmarks/`, and
  `packages/react-email/src/components/code-block/prism.ts` (vendored Prism).
