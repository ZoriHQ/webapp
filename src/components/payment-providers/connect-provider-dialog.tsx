import { useEffect, useState } from 'react'
import { IconExternalLink, IconEye, IconEyeOff } from '@tabler/icons-react'
import { toast } from 'sonner'
import type { ProviderType } from '@/lib/payment-provider-icons'
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
import {
  useCreatePaymentProvider,
  useProviderInstructions,
} from '@/hooks/use-payment-providers'
import {
  PROVIDER_TYPES,
  getProviderColor,
  getProviderIcon,
} from '@/lib/payment-provider-icons'

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
  const [selectedProvider, setSelectedProvider] = useState<ProviderType | null>(
    null,
  )
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [showFields, setShowFields] = useState<Record<string, boolean>>({})

  const createProvider = useCreatePaymentProvider()
  const { data: instructions, isLoading: instructionsLoading } =
    useProviderInstructions(selectedProvider || undefined, projectId)

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setSelectedProvider(null)
      setFormData({})
      setShowFields({})
    }
  }, [open])

  const handleOAuthConnect = () => {
    if (instructions?.oauth_url) {
      // Open OAuth URL in a new window
      const width = 600
      const height = 700
      const left = window.screenX + (window.outerWidth - width) / 2
      const top = window.screenY + (window.outerHeight - height) / 2

      window.open(
        instructions.oauth_url,
        'oauth',
        `width=${width},height=${height},left=${left},top=${top}`,
      )

      // Close the dialog
      onOpenChange(false)
    }
  }

  const handleManualConnect = async () => {
    if (!selectedProvider) {
      return
    }

    // Check if all required fields are filled
    const requiredFields = instructions?.fields?.filter((f) => f.required) || []
    const missingFields = requiredFields.filter((f) => !formData[f.name || ''])

    if (missingFields.length > 0) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      await createProvider.mutateAsync({
        project_id: projectId,
        provider_type: selectedProvider,
        api_key: formData.api_key || '',
        webhook_secret: formData.webhook_secret || '',
      })

      toast.success(
        `${PROVIDER_TYPES.find((p) => p.value === selectedProvider)?.label} connected successfully`,
      )

      // Reset form and close dialog
      setSelectedProvider(null)
      setFormData({})
      setShowFields({})
      onOpenChange(false)
    } catch (error) {
      toast.error('Failed to connect provider. Please check your credentials.')
      console.error('Error connecting provider:', error)
    }
  }

  const handleBack = () => {
    setSelectedProvider(null)
    setFormData({})
    setShowFields({})
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {selectedProvider
              ? 'Connect Payment Provider'
              : 'Select Payment Provider'}
          </DialogTitle>
          <DialogDescription>
            {selectedProvider
              ? `Enter your ${PROVIDER_TYPES.find((p) => p.value === selectedProvider)?.label} credentials`
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
                  onClick={() =>
                    !isComingSoon && setSelectedProvider(provider.value)
                  }
                  disabled={isComingSoon}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors text-left ${
                    isComingSoon
                      ? 'opacity-60 cursor-not-allowed'
                      : 'hover:border-primary hover:bg-accent'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${getProviderColor(provider.value)}`}
                  >
                    {getProviderIcon(provider.value, 'h-5 w-5')}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="font-medium text-sm">
                        {provider.label}
                      </div>
                      {isComingSoon && (
                        <Badge variant="secondary" className="text-xs">
                          Coming Soon
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {provider.description}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        ) : instructionsLoading ? (
          <div className="py-8 text-center text-muted-foreground">
            Loading connection options...
          </div>
        ) : (
          <div className="space-y-4 py-4">
            {instructions?.instructions && (
              <Alert>
                <AlertDescription className="text-xs whitespace-pre-line">
                  {instructions.instructions}
                </AlertDescription>
              </Alert>
            )}

            {instructions?.connection_method === 'oauth' &&
            instructions.oauth_url ? (
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Click the button below to connect via OAuth. You'll be
                  redirected back here after authorization.
                </div>
                <Button onClick={handleOAuthConnect} className="w-full">
                  <IconExternalLink className="h-4 w-4 mr-2" />
                  Connect with{' '}
                  {
                    PROVIDER_TYPES.find((p) => p.value === selectedProvider)
                      ?.label
                  }
                </Button>

                {instructions.fields && instructions.fields.length > 0 && (
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or connect manually
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            {instructions?.connection_method === 'manual' ||
            (instructions?.connection_method === 'oauth' &&
              instructions.fields &&
              instructions.fields.length > 0) ? (
              <div className="space-y-4">
                {instructions.fields?.map((field) => (
                  <div key={field.name} className="space-y-2">
                    <Label htmlFor={field.name}>
                      {field.label || field.name} {field.required && '*'}
                    </Label>
                    <div className="relative">
                      <Input
                        id={field.name}
                        type={
                          field.type === 'password' &&
                          showFields[field.name || '']
                            ? 'text'
                            : field.type || 'text'
                        }
                        placeholder={field.placeholder || ''}
                        value={formData[field.name || ''] || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [field.name || '']: e.target.value,
                          })
                        }
                        className={field.type === 'password' ? 'pr-10' : ''}
                      />
                      {field.type === 'password' && (
                        <button
                          type="button"
                          onClick={() =>
                            setShowFields({
                              ...showFields,
                              [field.name || '']: !showFields[field.name || ''],
                            })
                          }
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showFields[field.name || ''] ? (
                            <IconEyeOff className="h-4 w-4" />
                          ) : (
                            <IconEye className="h-4 w-4" />
                          )}
                        </button>
                      )}
                    </div>
                    {field.help_text && (
                      <p className="text-xs text-muted-foreground">
                        {field.help_text}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        )}

        <DialogFooter>
          {selectedProvider ? (
            <>
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              {instructions?.connection_method === 'manual' ||
              (instructions?.fields && instructions.fields.length > 0) ? (
                <Button
                  onClick={handleManualConnect}
                  disabled={createProvider.isPending}
                >
                  {createProvider.isPending
                    ? 'Connecting...'
                    : 'Connect Provider'}
                </Button>
              ) : null}
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
