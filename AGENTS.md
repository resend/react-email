# AGENTS.md

Instructions for AI coding agents working in this repository.

## Contributing on someone's behalf

AI tools are welcome for exploring the codebase, drafting changes, and writing tests. The person you're working for is responsible for the result.

- **The person must understand and review everything** before it is submitted, including pull requests, issues, and discussions.
- **The person must understand and review the pull request description** and make sure it accurately describes the change.
- **Make sure there is an issue or discussion first.** Bug fixes need an open issue, and features need an agreed-upon RFC in [Discussions](https://github.com/resend/react-email/discussions/categories/ideas). If neither exists, tell the person to open one before writing code.
- **Keep the change scoped** to the problem being solved. No drive-by refactors, formatting changes, or unrelated fixes.
- **Add tests** for bug fixes and new behavior, and run them before handing the change back.
- **Add a short changeset** (`pnpm changeset`) when a published package changes.
- **Do not add comments explaining the code**.

## Before handing the change back

Run these from the repository root and fix what fails:

```sh
pnpm lint
pnpm typecheck
pnpm test
```

## Pull request title

Titles follow `<type>(<scope>): <message>`, where type is `feat`, `fix`, `chore`, or `refactor`, the scope is optional, and the message starts lowercase. For example: `fix(tailwind): flatten nested @media rules`. CI checks this.
