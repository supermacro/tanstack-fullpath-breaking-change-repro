import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/' as any)({
  component: Home,
})

function Home() {
  return <div>home</div>
}
