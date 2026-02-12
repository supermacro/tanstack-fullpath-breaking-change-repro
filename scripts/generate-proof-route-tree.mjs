import fs from 'node:fs'

const snapshotPath = process.argv[2]

if (!snapshotPath) {
  console.error('Usage: node scripts/generate-proof-route-tree.mjs <snapshot-path>')
  process.exit(1)
}

const snapshot = fs.readFileSync(snapshotPath, 'utf8')

const fullPathStart = snapshot.indexOf('export interface FileRoutesByFullPath {')
const fullPathEnd = snapshot.indexOf(
  '\n}\nexport interface FileRoutesByTo',
  fullPathStart,
)

if (fullPathStart === -1 || fullPathEnd === -1) {
  console.error('Could not locate FileRoutesByFullPath/FileRoutesByTo in snapshot')
  process.exit(1)
}

const fullPathBlock = snapshot.slice(fullPathStart, fullPathEnd)
const hasTrailingInFullPath = fullPathBlock.includes("'/posts/$postId/':")

const fullPathKey = hasTrailingInFullPath ? '/posts/$postId/' : '/posts/$postId'

const output = `/* eslint-disable */\n\n// @ts-nocheck\n\n// Generated from a true TanStack Router snapshot file.\n\nexport const routeTree = {} as any\n\nexport interface FileRoutesByFullPath {\n  '/': unknown\n  '/posts': unknown\n  '${fullPathKey}': unknown\n}\n\nexport interface FileRoutesByTo {\n  '/': unknown\n  '/posts': unknown\n  '/posts/$postId': unknown\n}\n`

fs.writeFileSync('src/routeTree.gen.ts', output)

console.log(
  `Wrote src/routeTree.gen.ts using ${snapshotPath} (fullPath key: ${fullPathKey})`,
)
