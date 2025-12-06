import { IconBrain, IconCode, IconRoute } from '@tabler/icons-react'

export type LLMProviderType = 'openrouter' | 'manual'

export function getLLMProviderIcon(providerType?: string, className?: string) {
  const iconClass = className || 'h-5 w-5'

  switch (providerType) {
    case 'openrouter':
      return <IconRoute className={iconClass} />
    case 'manual':
      return <IconCode className={iconClass} />
    default:
      return <IconBrain className={iconClass} />
  }
}

export function getLLMProviderName(providerType?: string): string {
  switch (providerType) {
    case 'openrouter':
      return 'OpenRouter'
    case 'manual':
      return 'Manual Ingestion'
    default:
      return 'Unknown Provider'
  }
}

export function getLLMProviderColor(providerType?: string): string {
  switch (providerType) {
    case 'openrouter':
      return 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400'
    case 'manual':
      return 'bg-slate-100 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400'
    default:
      return 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400'
  }
}

export const LLM_PROVIDER_TYPES: Array<{
  value: LLMProviderType
  label: string
  description: string
  comingSoon: boolean
}> = [
  {
    value: 'openrouter',
    label: 'OpenRouter',
    description:
      'Route LLM requests through OpenRouter with Langfuse integration',
    comingSoon: false,
  },
  {
    value: 'manual',
    label: 'Manual Ingestion',
    description: 'Send traces directly via API',
    comingSoon: true,
  },
]

export const LANGFUSE_INGESTION_URL = 'https://ingestion.zorihq.com'
