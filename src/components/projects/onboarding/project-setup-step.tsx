import { useState } from 'react'
import {
  IconCheck,
  IconCode,
  IconCopy,
  IconExternalLink,
} from '@tabler/icons-react'
import { toast } from 'sonner'
import { InstallationExamples } from '../installation-examples'
import type { CreatedProject } from './project-onboarding'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface ProjectSetupStepProps {
  project: CreatedProject | null
}

export function ProjectSetupStep({ project }: ProjectSetupStepProps) {
  const [copiedToken, setCopiedToken] = useState(false)

  if (!project) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Loading project details...</p>
      </div>
    )
  }

  const handleCopyToken = () => {
    navigator.clipboard.writeText(project.projectToken)
    setCopiedToken(true)
    toast.success('Project token copied!')
    setTimeout(() => setCopiedToken(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
          <IconCheck className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2">
          Project Created Successfully!
        </h2>
        <p className="text-muted-foreground">
          Now let's add the tracking script to your website to start collecting
          analytics data.
        </p>
      </div>

      {/* Project Details */}
      <Card className="p-4 bg-muted/30">
        <div className="flex flex-col md:flex-row justify-evenly items-center gap-4 text-sm">
          <div className="flex flex-col items-center text-center">
            <span className="text-muted-foreground">Project Name:</span>
            <p className="font-medium">{project.name}</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="text-muted-foreground">Website:</span>
            <p className="font-medium">{project.domain}</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="text-muted-foreground">Project Token:</span>
            <div className="flex items-center gap-2">
              <code className="text-xs bg-background px-2  overflow-clip py-1 rounded border">
                {project.projectToken}
              </code>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleCopyToken}
              >
                {copiedToken ? (
                  <IconCheck className="h-3 w-3 text-green-500" />
                ) : (
                  <IconCopy className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Installation Examples */}
      <InstallationExamples projectToken={project.projectToken} />

      {/* Help Section */}
      <Card className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
        <div className="flex gap-3">
          <IconCode className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
          <div className="space-y-2">
            <h4 className="font-medium text-blue-900 dark:text-blue-100">
              Need help with installation?
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Check out our detailed installation guide or contact our support
              team for assistance.
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-blue-700 border-blue-300"
              >
                <IconExternalLink className="w-4 h-4 mr-2" />
                View Docs
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-blue-700 border-blue-300"
              >
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
