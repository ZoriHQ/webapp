import { useState } from 'react'
import { IconLoader2 } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Card } from '@/components/ui/card'
import { useProject } from '@/hooks/use-projects'

interface GeneralSettingsTabProps {
  projectId: string
}

export function GeneralSettingsTab({ projectId }: GeneralSettingsTabProps) {
  const { data: project, isLoading } = useProject(projectId)
  const [projectName, setProjectName] = useState(project?.name || '')
  const [projectUrl, setProjectUrl] = useState(project?.domain || '')

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <IconLoader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const handleSave = () => {
    // TODO: Implement project update mutation
    console.log('Save general settings:', { projectName, projectUrl })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">General Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your project's basic information
        </p>
      </div>

      <Separator />

      <Card className="p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="projectName">Project Name</Label>
            <Input
              id="projectName"
              placeholder="My Awesome Project"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              This is the display name for your project
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectUrl">Project URL</Label>
            <Input
              id="projectUrl"
              placeholder="https://example.com"
              value={projectUrl}
              onChange={(e) => setProjectUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              The primary domain where your project is hosted
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectId">Project ID</Label>
            <div className="flex gap-2">
              <Input
                id="projectId"
                value={projectId}
                disabled
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                onClick={() => navigator.clipboard.writeText(projectId)}
              >
                Copy
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Use this ID for API requests and SDK initialization
            </p>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </Card>

      <Separator />

      <Card className="p-6 border-destructive">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-destructive">
              Danger Zone
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              Irreversible and destructive actions
            </p>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-destructive/50 p-4">
            <div>
              <div className="text-sm font-medium">Delete Project</div>
              <div className="text-xs text-muted-foreground">
                Permanently delete this project and all its data
              </div>
            </div>
            <Button variant="destructive" size="sm">
              Delete Project
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
