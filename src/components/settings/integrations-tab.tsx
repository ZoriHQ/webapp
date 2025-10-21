import { Separator } from '@/components/ui/separator'
import { ProviderList } from '@/components/payment-providers/provider-list'

interface IntegrationsTabProps {
  projectId: string
}

export function IntegrationsTab({ projectId }: IntegrationsTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Integrations</h3>
        <p className="text-sm text-muted-foreground">
          Connect third-party services to enhance your analytics
        </p>
      </div>

      <Separator />

      <ProviderList projectId={projectId} />
    </div>
  )
}
