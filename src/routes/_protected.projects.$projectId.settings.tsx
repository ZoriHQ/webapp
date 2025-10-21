import { createFileRoute } from '@tanstack/react-router'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GeneralSettingsTab } from '@/components/settings/general-settings-tab'
import { IntegrationsTab } from '@/components/settings/integrations-tab'
import { useProject } from '@/hooks/use-projects'

export const Route = createFileRoute('/_protected/projects/$projectId/settings')({
  component: ProjectSettings,
})

function ProjectSettings() {
  const { projectId } = Route.useParams()
  const { data: project } = useProject(projectId)

  return (
    <div className="container mx-auto py-6 px-4 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Project Settings</h1>
        <p className="text-muted-foreground">
          Manage settings and integrations for {project?.name || 'your project'}
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <GeneralSettingsTab projectId={projectId} />
        </TabsContent>

        <TabsContent value="integrations" className="mt-6">
          <IntegrationsTab projectId={projectId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
