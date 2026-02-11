# TanStack Router FullPath trailing slash breaking change repro

Minimal **React + Vite + TypeScript** reproduction for:

- https://github.com/TanStack/router/issues/6635

This repro demonstrates the post-`b42f84a4f6ffac19051f698d34fc9a64eca62a46` behavior where index-style full paths gain a trailing slash in `FileRoutesByFullPath`.

## Reproduction steps

1. Install dependencies:

```bash
npm install
```

2. Run the build (which also runs TypeScript type-check):

```bash
npm run build
```

3. Observe the type error:

```text
src/routes/posts.$postId.index.tsx(...): error TS2339: Property '/posts/$postId' does not exist on type 'FileRoutesByFullPath'.
```

## Why this fails

In `src/routes/posts.$postId.index.tsx`, the repro intentionally references:

- `FileRoutesByFullPath['/posts/$postId']`

But generated route types now expose that full path as:

- `'/posts/$postId/'`

So type-checking fails.

## Key files

- `src/routes/posts.$postId.index.tsx` (intentional failing type)
- `src/routeTree.gen.ts` (generated output showing `'/posts/$postId/'` in `FileRoutesByFullPath` and `'/posts/$postId'` in `FileRoutesByTo`)
