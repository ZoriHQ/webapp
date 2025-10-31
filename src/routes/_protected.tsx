// eslint-disable-next-line
import { createFileRoute, Outlet, useParams } from '@tanstack/react-router'
import { useState } from 'react'
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

  return (
    <SidebarProvider>
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
                {projectId && <RevenueStatusIndicator projectId={projectId} />}
              </header>
              <main className="flex flex-1 flex-col p-6 overflow-auto">
                <Outlet />
              </main>
            </div>
          </div>
        </SidebarInset>
        <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
      </div>
    </SidebarProvider>
  )
}
