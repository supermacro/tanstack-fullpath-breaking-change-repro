import { createFileRoute } from '@tanstack/react-router'
import type { FileRoutesByFullPath } from '../routeTree.gen'

// Expected key before b42f84a4f6ffac19051f698d34fc9a64eca62a46.
// On commits after that change, generator emits '/posts/$postId/' instead.
export type ReproBreakage = FileRoutesByFullPath['/posts/$postId']

export const Route = createFileRoute('/posts/$postId/' as any)({
  component: PostDetail,
})

function PostDetail() {
  return <div>post detail</div>
}
