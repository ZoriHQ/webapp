import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { IconWorld } from '@tabler/icons-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useCreateProject } from '@/hooks/use-projects'

export const Route = createFileRoute('/_protected/projects/new')({
  component: NewProjectPage,
})

function NewProjectPage() {
  const navigate = useNavigate()
  const [newProject, setNewProject] = useState({
    name: '',
    websiteUrl: '',
    allowLocalhost: false,
  })

  const createProjectMutation = useCreateProject()

  const handleCreateProject = () => {
    createProjectMutation.mutate(
      {
        name: newProject.name,
        website_url: newProject.websiteUrl,
        allow_localhost: newProject.allowLocalhost,
      },
      {
        onSuccess: (data) => {
          toast.success('Project created successfully!')
          // Navigate to the new project's overview page
          if (data.id) {
            navigate({
              to: '/projects/$projectId',
              params: { projectId: data.id },
            }).then(() => {
              // Force a page reload to ensure the project data is loaded
              window.location.reload()
            })
          }
        },
        onError: (error) => {
          toast.error('Failed to create project: ' + error.message)
        },
      },
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Project</h1>
        <p className="text-muted-foreground">
          Set up tracking for a new website
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>
            Enter the details of the website you want to track
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              placeholder="My Awesome Website"
              value={newProject.name}
              onChange={(e) =>
                setNewProject({ ...newProject, name: e.target.value })
              }
            />
            <p className="text-sm text-muted-foreground">
              A friendly name to identify your project
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website URL</Label>
            <div className="flex gap-2">
              <div className="flex items-center justify-center px-3 bg-muted rounded-md">
                <IconWorld className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                id="website"
                type="url"
                placeholder="https://example.com"
                value={newProject.websiteUrl}
                onChange={(e) =>
                  setNewProject({
                    ...newProject,
                    websiteUrl: e.target.value,
                  })
                }
              />
            </div>
            <p className="text-sm text-muted-foreground">
              The URL of the website you want to track
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="localhost"
              checked={newProject.allowLocalhost}
              onCheckedChange={(checked) =>
                setNewProject({
                  ...newProject,
                  allowLocalhost: checked as boolean,
                })
              }
            />
            <Label
              htmlFor="localhost"
              className="text-sm font-normal cursor-pointer"
            >
              Allow tracking on localhost (for development)
            </Label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => navigate({ to: '/projects' })}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateProject}
              disabled={
                !newProject.name ||
                !newProject.websiteUrl ||
                createProjectMutation.isPending
              }
            >
              {createProjectMutation.isPending
                ? 'Creating...'
                : 'Create Project'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
