# React Email - Agent Guidelines

## Build/Test Commands
- `pnpm build` - Build all packages using Turbo
- `pnpm test` - Run all tests using Vitest
- `pnpm test:watch` - Run tests in watch mode
- `pnpm lint` - Check code with Biome linter
- `pnpm lint:fix` - Fix linting issues automatically
- Run single test: `cd packages/[package-name] && pnpm test [test-file]`

## Code Style (Biome Config)
- **Formatting**: 2 spaces, 80 char line width, single quotes, use `pnpm lint` for checking formatting and linting, and use `pnpm lint:fix` to lint and format all files
- **Imports**: Use `import type` for types, organize imports automatically
- **Components**: Use `React.forwardRef` for all package components in `packages` if they support React 18 with proper displayName
- **Functions**: Always prefer `const ... = () => {...}` rather than `function`
- **Exports**: Use named exports, avoid default exports because they are hard to refactor
- **Error Handling**: Use proper TypeScript types, avoid `any`, and only if necessary, use `unknown`

## Project Structure
- Monorepo with packages in `packages/*`, `apps/*`
- Each package has `src/index.ts`, component file, and `.spec.tsx` test
- Tests use Vitest with `@react-email/render` for HTML output testing
- Use `turbo run` commands for cross-package operations
- Documentation is written using Mintlify
- There are apps in `apps` that we publish
    - `apps/demo`: https://demo.react.email
    - `apps/docs`: https://react.email/docs
    - `apps/web`: https://react.email

