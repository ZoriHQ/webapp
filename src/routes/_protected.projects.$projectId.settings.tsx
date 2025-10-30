import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GeneralSettingsTab } from '@/components/settings/general-settings-tab'
import { IntegrationsTab } from '@/components/settings/integrations-tab'
import { InstallationTab } from '@/components/settings/installation-tab'
import { useProject } from '@/hooks/use-projects'

export const Route = createFileRoute('/_protected/projects/$projectId/settings')({
  component: ProjectSettings,
})

function ProjectSettings() {
  const { projectId } = Route.useParams()
  const { data: project } = useProject(projectId)

  // Handle OAuth callback from payment provider
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const provider = searchParams.get('provider')
    const result = searchParams.get('result')

    if (provider && result) {
      // Show toast notification
      if (result === 'success') {
        toast.success(`Successfully connected ${provider}`)
      } else if (result === 'failure') {
        toast.error(`Failed to connect ${provider}`)
      }

      // Clean up URL by removing query params
      const newUrl = window.location.pathname
      window.history.replaceState({}, '', newUrl)
    }
  }, [])

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Project Settings</h1>
        <p className="text-muted-foreground">
          Manage settings and integrations for {project?.name || 'your project'}
        </p>
      </div>

      <Tabs defaultValue="general" className="flex flex-row gap-6 w-full">
        <TabsList className="flex flex-col h-fit w-48 items-stretch p-1 gap-1">
          <TabsTrigger value="general" className="justify-start">
            General
          </TabsTrigger>
          <TabsTrigger value="installation" className="justify-start">
            Installation
          </TabsTrigger>
          <TabsTrigger value="integrations" className="justify-start">
            Integrations
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 min-w-0">
          <TabsContent value="general" className="mt-0">
            <GeneralSettingsTab projectId={projectId} />
          </TabsContent>

          <TabsContent value="installation" className="mt-0">
            {project?.project_token && (
              <InstallationTab projectToken={project.project_token} />
            )}
          </TabsContent>

          <TabsContent value="integrations" className="mt-0">
            <IntegrationsTab projectId={projectId} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
