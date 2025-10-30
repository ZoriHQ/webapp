import { useState } from 'react'
import {
  IconAlertTriangle,
  IconCurrencyDollar,
  IconEdit,
  IconLoader2,
  IconPlug,
  IconTrash,
} from '@tabler/icons-react'
import { formatDistanceToNow } from 'date-fns'
import type Zoriapi from 'zorihq'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { usePaymentProviders } from '@/hooks/use-payment-providers'
import { getProviderIcon, getProviderName } from '@/lib/payment-provider-icons'
import { ConnectProviderDialog } from '@/components/payment-providers/connect-provider-dialog'
import { EditProviderDialog } from '@/components/payment-providers/edit-provider-dialog'
import { DeleteProviderDialog } from '@/components/payment-providers/delete-provider-dialog'

interface RevenueStatusIndicatorProps {
  projectId?: string
}

export function RevenueStatusIndicator({
  projectId,
}: RevenueStatusIndicatorProps) {
  const [connectDialogOpen, setConnectDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<Zoriapi.V1.PaymentProviders.PaymentProviderResponse | null>(null)
  const { data: providersData, isLoading } = usePaymentProviders(projectId)

  // Don't render if no projectId (not on a project page)
  if (!projectId) {
    return null
  }

  const providers = providersData?.providers || []
  const activeProviders = providers.filter((p) => p.is_active)
  const hasProviders = activeProviders.length > 0

  return (
    <>
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          {isLoading ? (
            <IconLoader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : hasProviders ? (
            <>
              <IconCurrencyDollar className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-green-500" />
            </>
          ) : (
            <IconAlertTriangle className="h-4 w-4 text-amber-500 dark:text-amber-400" />
          )}
          <span className="sr-only">Revenue attribution status</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 z-[100]">
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-sm mb-1">Revenue Attribution</h4>
            <p className="text-xs text-muted-foreground">
              {hasProviders
                ? 'Connected payment providers enable revenue tracking by traffic source'
                : 'Connect a payment provider to track revenue by traffic source'}
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <IconLoader2 className="h-4 w-4 animate-spin" />
              <span>Loading providers...</span>
            </div>
          ) : hasProviders ? (
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Connected Providers
              </div>
              {activeProviders.map((provider) => (
                <div
                  key={provider.id}
                  className="flex items-center gap-2 rounded-md border p-2"
                >
                  <div className="flex items-center gap-2 flex-1">
                    {getProviderIcon(provider.provider_type)}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">
                        {getProviderName(provider.provider_type)}
                      </div>
                      {provider.last_synced_at && (
                        <div className="text-xs text-muted-foreground">
                          Synced{' '}
                          {formatDistanceToNow(new Date(provider.last_synced_at), {
                            addSuffix: true,
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedProvider(provider)
                        setEditDialogOpen(true)
                      }}
                    >
                      <IconEdit className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedProvider(provider)
                        setDeleteDialogOpen(true)
                      }}
                    >
                      <IconTrash className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-md border border-dashed p-3 text-center">
              <IconPlug className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                No payment providers connected yet
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              variant={hasProviders ? 'outline' : 'default'}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setConnectDialogOpen(true)
              }}
              className="flex-1"
            >
              <IconPlug className="h-4 w-4 mr-2" />
              {hasProviders ? 'Add Provider' : 'Connect Provider'}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>

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
    </>
  )
}
