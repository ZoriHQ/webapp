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
import { Badge } from '@/components/ui/badge'
import { useCreatePaymentProvider } from '@/hooks/use-payment-providers'
import { getProviderIcon, getProviderColor, PROVIDER_TYPES, type ProviderType } from '@/lib/payment-provider-icons'
import { getProviderGuide } from '@/lib/provider-guides'
import { toast } from 'sonner'

interface ConnectProviderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
}

export function ConnectProviderDialog({
  open,
  onOpenChange,
  projectId,
}: ConnectProviderDialogProps) {
  const [selectedProvider, setSelectedProvider] = useState<ProviderType | null>(null)
  const [apiKey, setApiKey] = useState('')
  const [webhookSecret, setWebhookSecret] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)
  const [showWebhookSecret, setShowWebhookSecret] = useState(false)

  const createProvider = useCreatePaymentProvider()

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setSelectedProvider(null)
      setApiKey('')
      setWebhookSecret('')
      setShowApiKey(false)
      setShowWebhookSecret(false)
    }
  }, [open])

  const handleConnect = async () => {
    if (!selectedProvider || !apiKey || !webhookSecret) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      await createProvider.mutateAsync({
        project_id: projectId,
        provider_type: selectedProvider,
        api_key: apiKey,
        webhook_secret: webhookSecret,
      })

      toast.success(`${PROVIDER_TYPES.find(p => p.value === selectedProvider)?.label} connected successfully`)

      // Reset form and close dialog
      setSelectedProvider(null)
      setApiKey('')
      setWebhookSecret('')
      setShowApiKey(false)
      setShowWebhookSecret(false)
      onOpenChange(false)
    } catch (error) {
      toast.error('Failed to connect provider. Please check your credentials.')
      console.error('Error connecting provider:', error)
    }
  }

  const handleBack = () => {
    setSelectedProvider(null)
    setApiKey('')
    setWebhookSecret('')
  }

  const guide = selectedProvider ? getProviderGuide(selectedProvider) : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {selectedProvider ? 'Connect Payment Provider' : 'Select Payment Provider'}
          </DialogTitle>
          <DialogDescription>
            {selectedProvider
              ? `Enter your ${PROVIDER_TYPES.find(p => p.value === selectedProvider)?.label} credentials`
              : 'Choose a payment provider to connect for revenue attribution'}
          </DialogDescription>
        </DialogHeader>

        {!selectedProvider ? (
          <div className="grid gap-3 py-4">
            {PROVIDER_TYPES.map((provider) => {
              const isComingSoon = provider.value !== 'stripe'
              return (
                <button
                  key={provider.value}
                  onClick={() => !isComingSoon && setSelectedProvider(provider.value)}
                  disabled={isComingSoon}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors text-left ${
                    isComingSoon
                      ? 'opacity-60 cursor-not-allowed'
                      : 'hover:border-primary hover:bg-accent'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getProviderColor(provider.value)}`}>
                    {getProviderIcon(provider.value, 'h-5 w-5')}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="font-medium text-sm">{provider.label}</div>
                      {isComingSoon && (
                        <Badge variant="secondary" className="text-xs">
                          Coming Soon
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">{provider.description}</div>
                  </div>
                </button>
              )
            })}
          </div>
        ) : (
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
        )}

        <DialogFooter>
          {selectedProvider ? (
            <>
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleConnect} disabled={createProvider.isPending}>
                {createProvider.isPending ? 'Connecting...' : 'Connect Provider'}
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
