import { useEffect, useState } from 'react'
import { IconCheck, IconCopy, IconExternalLink } from '@tabler/icons-react'
import { toast } from 'sonner'
import type Zoriapi from 'zorihq'
import type { LLMProviderType } from '@/lib/llm-provider-icons'
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
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  LANGFUSE_INGESTION_URL,
  LLM_PROVIDER_TYPES,
  getLLMProviderColor,
  getLLMProviderIcon,
} from '@/lib/llm-provider-icons'

interface ConnectLLMProviderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: Zoriapi.V1.Projects.Project | undefined
  initialProvider?: string | null
}

type CopiedField = 'public_key' | 'secret_key' | 'url' | null

export function ConnectLLMProviderDialog({
  open,
  onOpenChange,
  project,
  initialProvider,
}: ConnectLLMProviderDialogProps) {
  const [selectedProvider, setSelectedProvider] =
    useState<LLMProviderType | null>(null)
  const [copiedField, setCopiedField] = useState<CopiedField>(null)

  useEffect(() => {
    if (open && initialProvider) {
      setSelectedProvider(initialProvider as LLMProviderType)
    } else if (!open) {
      setSelectedProvider(null)
      setCopiedField(null)
    }
  }, [open, initialProvider])

  const handleCopy = async (value: string, field: CopiedField) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopiedField(field)
      toast.success('Copied to clipboard')
      setTimeout(() => setCopiedField(null), 2000)
    } catch {
      toast.error('Failed to copy')
    }
  }

  const handleBack = () => {
    setSelectedProvider(null)
    setCopiedField(null)
  }

  const renderProviderSelection = () => (
    <div className="grid gap-3 py-4">
      {LLM_PROVIDER_TYPES.map((provider) => (
        <button
          key={provider.value}
          onClick={() =>
            !provider.comingSoon && setSelectedProvider(provider.value)
          }
          disabled={provider.comingSoon}
          className={`flex items-center gap-3 p-3 rounded-lg border transition-colors text-left ${
            provider.comingSoon
              ? 'opacity-60 cursor-not-allowed'
              : 'hover:border-primary hover:bg-accent'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${getLLMProviderColor(provider.value)}`}
          >
            {getLLMProviderIcon(provider.value, 'h-5 w-5')}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div className="font-medium text-sm">{provider.label}</div>
              {provider.comingSoon && (
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
      ))}
    </div>
  )

  const renderOpenRouterConfig = () => {
    const publicKey = project?.langfuse_public_key || ''
    const secretKey = project?.langfuse_secret_key || ''

    return (
      <div className="space-y-4 py-4">
        <Alert>
          <AlertDescription className="text-xs">
            To enable LLM trace tracking, add these Langfuse credentials to your
            OpenRouter account under the Broadcast settings.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="langfuse_url">Langfuse Host URL</Label>
            <div className="flex gap-2">
              <Input
                id="langfuse_url"
                value={LANGFUSE_INGESTION_URL}
                readOnly
                className="font-mono text-sm bg-muted"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleCopy(LANGFUSE_INGESTION_URL, 'url')}
                className="shrink-0"
              >
                {copiedField === 'url' ? (
                  <IconCheck className="h-4 w-4 text-green-500" />
                ) : (
                  <IconCopy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="langfuse_public_key">Langfuse Public Key</Label>
            <div className="flex gap-2">
              <Input
                id="langfuse_public_key"
                value={publicKey}
                readOnly
                className="font-mono text-sm bg-muted"
                placeholder={publicKey ? undefined : 'Not configured'}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleCopy(publicKey, 'public_key')}
                className="shrink-0"
                disabled={!publicKey}
              >
                {copiedField === 'public_key' ? (
                  <IconCheck className="h-4 w-4 text-green-500" />
                ) : (
                  <IconCopy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="langfuse_secret_key">Langfuse Secret Key</Label>
            <div className="flex gap-2">
              <Input
                id="langfuse_secret_key"
                value={secretKey}
                readOnly
                type="password"
                className="font-mono text-sm bg-muted"
                placeholder={secretKey ? undefined : 'Not configured'}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleCopy(secretKey, 'secret_key')}
                className="shrink-0"
                disabled={!secretKey}
              >
                {copiedField === 'secret_key' ? (
                  <IconCheck className="h-4 w-4 text-green-500" />
                ) : (
                  <IconCopy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <a
            href="https://openrouter.ai/settings/integrations"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            <IconExternalLink className="h-4 w-4" />
            Open OpenRouter Integrations
          </a>
        </div>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {selectedProvider
              ? 'OpenRouter Integration'
              : 'Select LLM Provider'}
          </DialogTitle>
          <DialogDescription>
            {selectedProvider
              ? 'Copy these credentials to your OpenRouter Broadcast settings'
              : 'Choose an LLM provider to integrate for trace tracking'}
          </DialogDescription>
        </DialogHeader>

        {!selectedProvider
          ? renderProviderSelection()
          : renderOpenRouterConfig()}

        <DialogFooter>
          {selectedProvider ? (
            <>
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={() => onOpenChange(false)}>Done</Button>
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
