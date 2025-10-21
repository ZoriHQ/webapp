import { useState } from 'react'
import { IconPlus, IconLoader2 } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { usePaymentProviders } from '@/hooks/use-payment-providers'
import { ProviderCard } from './provider-card'
import { ConnectProviderDialog } from './connect-provider-dialog'
import { EditProviderDialog } from './edit-provider-dialog'
import { DeleteProviderDialog } from './delete-provider-dialog'
import type Zoriapi from 'zorihq'

interface ProviderListProps {
  projectId: string
}

export function ProviderList({ projectId }: ProviderListProps) {
  const [connectDialogOpen, setConnectDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<Zoriapi.V1.PaymentProviders.PaymentProviderResponse | null>(null)

  const { data: providersData, isLoading } = usePaymentProviders(projectId)

  const handleEdit = (provider: Zoriapi.V1.PaymentProviders.PaymentProviderResponse) => {
    setSelectedProvider(provider)
    setEditDialogOpen(true)
  }

  const handleDelete = (provider: Zoriapi.V1.PaymentProviders.PaymentProviderResponse) => {
    setSelectedProvider(provider)
    setDeleteDialogOpen(true)
  }

  const providers = providersData?.providers || []

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Connected Providers</h3>
          <p className="text-sm text-muted-foreground">
            Manage your payment provider integrations for revenue attribution
          </p>
        </div>
        <Button onClick={() => setConnectDialogOpen(true)}>
          <IconPlus className="h-4 w-4 mr-2" />
          Connect Provider
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <IconLoader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : providers.length > 0 ? (
        <div className="grid gap-3">
          {providers.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              onEdit={() => handleEdit(provider)}
              onDelete={() => handleDelete(provider)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <div className="mx-auto max-w-md">
            <h3 className="text-sm font-semibold mb-2">No providers connected</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Connect a payment provider to start tracking revenue by traffic source
            </p>
            <Button onClick={() => setConnectDialogOpen(true)}>
              <IconPlus className="h-4 w-4 mr-2" />
              Connect Your First Provider
            </Button>
          </div>
        </div>
      )}

      <ConnectProviderDialog
        open={connectDialogOpen}
        onOpenChange={setConnectDialogOpen}
        projectId={projectId}
      />

      <EditProviderDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        provider={selectedProvider}
      />

      <DeleteProviderDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        provider={selectedProvider}
      />
    </div>
  )
}
