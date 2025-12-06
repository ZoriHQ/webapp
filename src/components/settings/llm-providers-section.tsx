import { useState } from 'react'
import { IconBook } from '@tabler/icons-react'
import type Zoriapi from 'zorihq'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ConnectLLMProviderDialog } from '@/components/llm-providers/connect-provider-dialog'
import { RequestProviderCTA } from '@/components/llm-providers/request-provider-cta'
import {
  getLLMProviderColor,
  getLLMProviderIcon,
  LLM_PROVIDER_TYPES,
} from '@/lib/llm-provider-icons'

interface LLMProvidersSectionProps {
  project: Zoriapi.V1.Projects.Project | undefined
}

export function LLMProvidersSection({ project }: LLMProvidersSectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)

  const handleSeeInstructions = (providerValue: string) => {
    setSelectedProvider(providerValue)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">LLM Trace Providers</h3>
        <p className="text-sm text-muted-foreground">
          Configure LLM providers to track token usage and costs
        </p>
      </div>

      <div className="grid gap-3">
        {LLM_PROVIDER_TYPES.map((provider) => (
          <Card key={provider.value} className="p-4">
            <div className="flex items-center gap-3">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-lg ${getLLMProviderColor(provider.value)}`}
              >
                {getLLMProviderIcon(provider.value, 'h-5 w-5')}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm">{provider.label}</h4>
                  {provider.comingSoon && (
                    <Badge variant="secondary" className="text-xs">
                      Coming Soon
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {provider.description}
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSeeInstructions(provider.value)}
                disabled={provider.comingSoon}
              >
                <IconBook className="h-4 w-4 mr-2" />
                See Instructions
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <RequestProviderCTA />

      <ConnectLLMProviderDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        project={project}
        initialProvider={selectedProvider}
      />
    </div>
  )
}
