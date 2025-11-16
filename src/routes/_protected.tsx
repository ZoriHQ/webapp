import {
  Outlet,
  createFileRoute,
  useNavigate,
  useParams,
} from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import { CommandPalette } from '@/components/command-palette'
import { CommandPaletteTrigger } from '@/components/command-palette-trigger'
import { RevenueStatusIndicator } from '@/components/revenue-status-indicator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { getAuthMode, useAuthState } from '@/lib/auth'
import { AppContextProvider } from '@/contexts/app.context'

export const Route = createFileRoute('/_protected')({
  beforeLoad: async ({ location }) => {
    const { requireAuth } = await import('@/lib/route-guards')
    await requireAuth({ location })
  },

  component: ProtectedLayout,
})

function ProtectedLayout() {
  const [commandOpen, setCommandOpen] = useState(false)
  const params = useParams({ strict: false })
  const projectId = (params as { projectId?: string }).projectId
  const { isAuthenticated, isLoading } = useAuthState()
  const navigate = useNavigate()
  const authMode = getAuthMode()

  useEffect(() => {
    if (authMode === 'clerk' && !isLoading && !isAuthenticated) {
      navigate({ to: '/login' })
    }
  }, [authMode, isLoading, isAuthenticated, navigate])

  if (authMode === 'clerk' && isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (authMode === 'clerk' && !isAuthenticated) {
    return null
  }

  return (
    <SidebarProvider>
      <AppContextProvider values={null}>
        <div className="flex min-h-screen w-full bg-sidebar">
          <AppSidebar />
          <SidebarInset className="flex flex-1 flex-col">
            <div className="flex flex-col h-full p-4">
              <div className="flex flex-col flex-1 bg-background rounded-xl shadow-md border">
                <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 px-6 border-b bg-background rounded-t-xl">
                  <SidebarTrigger className="-ml-1" />
                  <Separator orientation="vertical" className="mr-2 h-4" />
                  <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-md">
                      <CommandPaletteTrigger
                        onClick={() => setCommandOpen(true)}
                      />
                    </div>
                  </div>
                  {/* Revenue Status Indicator - Only on project pages */}
                  {projectId && (
                    <RevenueStatusIndicator projectId={projectId} />
                  )}
                </header>
                <main className="flex flex-1 flex-col p-6 overflow-auto">
                  <Outlet />
                </main>
              </div>
            </div>
          </SidebarInset>
          <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
        </div>
      </AppContextProvider>
    </SidebarProvider>
  )
}
