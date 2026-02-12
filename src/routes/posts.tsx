import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/posts' as any)({
  component: PostsLayout,
})

function PostsLayout() {
  return <Outlet />
}
