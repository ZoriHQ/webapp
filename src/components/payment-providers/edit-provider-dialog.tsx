import { useState, useEffect } from 'react'
import { IconEye, IconEyeOff, IconExternalLink } from '@tabler/icons-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useUpdatePaymentProvider } from '@/hooks/use-payment-providers'
import { getProviderName } from '@/lib/payment-provider-icons'
import { getProviderGuide } from '@/lib/provider-guides'
import { toast } from 'sonner'
import type Zoriapi from 'zorihq'

interface EditProviderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  provider: Zoriapi.V1.PaymentProviders.PaymentProviderResponse | null
}

export function EditProviderDialog({
  open,
  onOpenChange,
  provider,
}: EditProviderDialogProps) {
  const [apiKey, setApiKey] = useState('')
  const [webhookSecret, setWebhookSecret] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)
  const [showWebhookSecret, setShowWebhookSecret] = useState(false)

  const updateProvider = useUpdatePaymentProvider(provider?.id || '')

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setApiKey('')
      setWebhookSecret('')
      setShowApiKey(false)
      setShowWebhookSecret(false)
    }
  }, [open])

  const handleUpdate = async () => {
    if (!provider || !apiKey || !webhookSecret) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      await updateProvider.mutateAsync({
        api_key: apiKey,
        webhook_secret: webhookSecret,
      })

      toast.success(`${getProviderName(provider.provider_type)} updated successfully`)

      // Reset form and close dialog
      setApiKey('')
      setWebhookSecret('')
      setShowApiKey(false)
      setShowWebhookSecret(false)
      onOpenChange(false)
    } catch (error) {
      toast.error('Failed to update provider. Please check your credentials.')
      console.error('Error updating provider:', error)
    }
  }

  const guide = provider?.provider_type ? getProviderGuide(provider.provider_type) : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            Edit {provider ? getProviderName(provider.provider_type) : 'Provider'}
          </DialogTitle>
          <DialogDescription>
            Update your {provider ? getProviderName(provider.provider_type) : 'provider'} credentials
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {guide && (
            <Alert>
              <AlertDescription className="text-xs">
                <div className="space-y-2">
                  <div>
                    <strong>API Key:</strong> {guide.apiKeyInstructions}
                    {guide.docsUrl && (
                      <a
                        href={guide.docsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 ml-1 text-primary hover:underline"
                      >
                        Learn more <IconExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                  <div>
                    <strong>Webhook Secret:</strong> {guide.webhookSecretInstructions}
                    {guide.webhookDocsUrl && (
                      <a
                        href={guide.webhookDocsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 ml-1 text-primary hover:underline"
                      >
                        Learn more <IconExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="apiKey">{guide?.apiKeyLabel || 'API Key'} *</Label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showApiKey ? 'text' : 'password'}
                placeholder={guide?.apiKeyPlaceholder || 'Enter API key'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showApiKey ? <IconEyeOff className="h-4 w-4" /> : <IconEye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="webhookSecret">{guide?.webhookSecretLabel || 'Webhook Secret'} *</Label>
            <div className="relative">
              <Input
                id="webhookSecret"
                type={showWebhookSecret ? 'text' : 'password'}
                placeholder={guide?.webhookSecretPlaceholder || 'Enter webhook secret'}
                value={webhookSecret}
                onChange={(e) => setWebhookSecret(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowWebhookSecret(!showWebhookSecret)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showWebhookSecret ? <IconEyeOff className="h-4 w-4" /> : <IconEye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={updateProvider.isPending}>
            {updateProvider.isPending ? 'Updating...' : 'Update Provider'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
