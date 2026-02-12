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
