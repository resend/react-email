# deepsec

This directory holds the [deepsec](https://www.npmjs.com/package/deepsec)
config for the parent repo. Checked into git so teammates inherit
project context (auth shape, threat model, custom matchers); generated
scan output is gitignored.

Currently configured project: `react-email` (target: `..`).

## Setup

This workspace was scaffolded with `npx deepsec@2.3.12 init --scaffold-only`
and `data/react-email/INFO.md` was written by hand. The Vercel project link,
model credentials, surface inventory and scan results are per-machine and
gitignored, so every checkout starts without them. `generated-matchers.ts`
is still empty: setup's model-backed phases have not been run and committed.

To set up a checkout, from this directory:

```bash
pnpm install
pnpm deepsec setup --model-profile <best|value|budget> --max-cost-usd <n>
```

`setup` links this workspace to a Vercel project (in a terminal it prompts
for a Vercel login and offers to create a dedicated project), then runs the
threat-model, coverage and review phases. Checkpoints in
`data/react-email/setup/setup-state.json` skip completed work, so re-running
the same command resumes. `--through coverage` stops before the file-by-file
review, which is the expensive part.

Use `--model-auth direct --ai-provider <provider> --ai-api-key-env <ENV_NAME>`
to pay with your own model key; secret values stay in the environment or
`.env.local`, and the Vercel link is still made. Use `--model-auth local` to
rely on a logged-in `claude` or `codex` CLI instead, which skips Vercel.

### Things specific to this repository

Observed with deepsec 2.3.12. Re-check them after upgrading.

- Use `setup` here, not `npx deepsec init` from the repo root. On a fresh
  clone `init` stops with "Workspace directory is not empty", and
  `init --force` resets `INFO.md` to the placeholder (or registers a second
  project when the checkout directory is not named `react-email`).
- `pnpm dlx deepsec` from the repo root fails, because the root
  `minimatch>brace-expansion` override is applied to deepsec's own
  dependencies. This directory is its own pnpm workspace, so `pnpm deepsec`
  works here.
- Prefer `setup` over a bare `scan` + `process` for the first run. Its
  coverage phase checks the scan against an inventory of entry points and
  generates matchers for the gaps. The stock scan alone does not select, for
  example, `export-single-template.ts` or `serve-static-file.ts`.
- The framework matchers are dormant: deepsec detects frameworks from the
  root `package.json`, which does not list `next`, `react` or `socket.io`.
  Naming them turns them on. This is free and merges into the existing
  candidates:
  `pnpm deepsec scan --matchers server-action,all-server-actions,all-route-handlers,unsafe-json-in-html,js-socketio-handler`
- `apps/web/src/app/api/send/test/route.ts` is never scanned, because the
  built-in ignore list drops `**/test/**`. Review it explicitly (this is an
  AI run):
  `pnpm deepsec process --files apps/web/src/app/api/send/test/route.ts --no-ignore`
- The built-in `insecure-crypto` matcher matches `DES` inside words such as
  `description`, which selects many files that have no other candidate.
  `pnpm deepsec process --skip-slugs insecure-crypto` skips those.
- This repository is public. Do not commit findings; `findings/` and
  `findings.json` are gitignored here. Report confirmed issues as described
  in `SECURITY.md`.

## Daily commands

```bash
pnpm deepsec scan
pnpm deepsec process     --concurrency 5
pnpm deepsec revalidate  --concurrency 5                  # cuts FP rate
pnpm deepsec export      --format md-dir --out ./findings
```

`--project-id` is auto-resolved while there's only one project in
`deepsec.config.ts`. Once you've added a second project, pass
`--project-id react-email` (or whichever id you want) explicitly.

`scan` is free (regex only). `process` is the AI stage (≈$0.30/file
on Opus by default). Run state goes to `data/react-email/`.

## Adding another project

To scan another codebase from this same `.deepsec/`:

```bash
pnpm deepsec init-project ../some-other-package   # path relative to .deepsec/
```

Appends an entry to `deepsec.config.ts` and writes
`data/<id>/{INFO.md,SETUP.md,project.json}`. Open the new SETUP.md
in your agent to fill in INFO.md.

## Layout

```
deepsec.config.ts        Project list (one entry per scanned repo)
data/react-email/
  INFO.md                Repo context — checked into git, hand-curated
  project.json           Generated (gitignored)
  files/                 One JSON per scanned source file (gitignored)
  runs/                  Run metadata (gitignored)
  reports/               Generated markdown reports (gitignored)
AGENTS.md                Pointer for coding agents
.env.local               Tokens (gitignored)
```

## Docs

After `pnpm install`:

- Skill: `node_modules/deepsec/SKILL.md`
- Full docs: `node_modules/deepsec/dist/docs/{getting-started,configuration,models,writing-matchers,plugins,architecture,data-layout,vercel-setup,faq}.md`

Or browse on
[GitHub](https://github.com/vercel-labs/deepsec/tree/main/docs).
