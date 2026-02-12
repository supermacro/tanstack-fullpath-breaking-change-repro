# TanStack Router fullPath trailing slash breaking change repro

Minimal **React + Vite + TypeScript** repro for:

- https://github.com/TanStack/router/issues/6635

This repo includes two deterministic proof commands:

- `proof:before-b42f84` uses a pre-`b42f84a4f6ffac19051f698d34fc9a64eca62a46` route tree snapshot.
- `proof:after-b42f84` uses a post-`b42f84a4f6ffac19051f698d34fc9a64eca62a46` route tree snapshot.

The only semantic difference between those snapshots is the `FileRoutesByFullPath` key:

- Before: `'/posts/$postId'`
- After: `'/posts/$postId/'`

## Reproduce the breaking change

1. Install deps:

```bash
npm install
```

2. Run the pre-commit proof command (should pass):

```bash
npm run proof:before-b42f84
```

Expected: no TypeScript errors.

3. Run the post-commit proof command (should fail):

```bash
npm run proof:after-b42f84
```

Expected TypeScript error:

```text
src/routes/posts.$postId.index.tsx(...): error TS2339: Property '/posts/$postId' does not exist on type 'FileRoutesByFullPath'.
```

## Why this proves the break

`src/routes/posts.$postId.index.tsx` contains:

- `type ReproBreakage = FileRoutesByFullPath['/posts/$postId']`

That type is valid with the pre-commit fullPath key set, and invalid once the trailing slash is introduced.

## How the true snapshots were generated

These are not hand-written snapshots. They were extracted from the TanStack Router git history:

- `snapshots/true/routeTree.pre-b42f84.snapshot.ts`
- `snapshots/true/routeTree.at-b42f84.snapshot.ts`

Source file used in TanStack Router history:

- `packages/router-generator/tests/generator/nested-verboseFileRoutes-false/routeTree.snapshot.ts`

Commands used to generate them:

```bash
git -C /Users/gio/dev/tanstack-router show b42f84a4f6ffac19051f698d34fc9a64eca62a46^:packages/router-generator/tests/generator/nested-verboseFileRoutes-false/routeTree.snapshot.ts > snapshots/true/routeTree.pre-b42f84.snapshot.ts
git -C /Users/gio/dev/tanstack-router show b42f84a4f6ffac19051f698d34fc9a64eca62a46:packages/router-generator/tests/generator/nested-verboseFileRoutes-false/routeTree.snapshot.ts > snapshots/true/routeTree.at-b42f84.snapshot.ts
```

The proof commands run `scripts/generate-proof-route-tree.mjs`, which reads each true snapshot and derives `src/routeTree.gen.ts` by preserving the observed fullPath key shape (`'/posts/$postId'` vs `'/posts/$postId/'`) before running `tsc`.
