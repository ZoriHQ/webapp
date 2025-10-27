import { InstallationExamples } from '../projects/installation-examples'

interface InstallationTabProps {
  projectToken: string
}

export function InstallationTab({ projectToken }: InstallationTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Installation Instructions</h3>
        <p className="text-sm text-muted-foreground">
          Add the ZoriHQ tracking script to your website to start collecting
          analytics data.
        </p>
      </div>

      <InstallationExamples projectToken={projectToken} />
    </div>
  )
}
