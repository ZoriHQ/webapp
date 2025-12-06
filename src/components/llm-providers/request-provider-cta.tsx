import { IconMail } from '@tabler/icons-react'

export function RequestProviderCTA() {
  return (
    <div className="text-center py-4 border-t">
      <p className="text-sm text-muted-foreground">
        Need a different provider?{' '}
        <a
          href="mailto:ideas@zorihq.com?subject=LLM Provider Request"
          className="inline-flex items-center gap-1 text-primary hover:underline"
        >
          <IconMail className="h-3.5 w-3.5" />
          Let us know
        </a>
      </p>
    </div>
  )
}
