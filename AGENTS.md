# Repository Agent Instructions

This repository follows the central doctrine in
[SylphxAI/doctrine](https://github.com/SylphxAI/doctrine).

Before changing behavior, read [PROJECT.md](./PROJECT.md) and
[.doctrine/project.json](./.doctrine/project.json). Keep enterprise policy in
doctrine; keep only repo-local mobile app facts here.

Useful validation for mobile changes:

- `bun install --frozen-lockfile`
- `bunx tsc --noEmit`
- `bun start` or target-specific Expo smoke for changed platform behavior

Do not reach into Demo Taskboard source internals, database tables, migrations,
or deployment state from the mobile client. Consume the documented event API
surface through `src/lib/api.ts`.
