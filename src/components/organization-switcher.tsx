'use client'

import { useAuth } from '@/lib/use-auth'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function OrganizationSwitcher() {
  const { organization } = useAuth()

  if (!organization) {
    return null
  }

  const orgInitial = organization.name?.charAt(0).toUpperCase() || 'O'
  const orgLogo = organization.logo_url

  return (
    <div className="flex h-screen w-16 flex-col items-center bg-background py-4 border-r">
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className={cn(
                'relative flex h-10 w-10 items-center justify-center rounded-lg transition-all hover:rounded-xl',
                'bg-primary text-primary-foreground shadow-sm',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              )}
              aria-label={organization.name || 'Organization'}
            >
              <Avatar className="h-full w-full rounded-lg">
                <AvatarImage
                  src={orgLogo}
                  alt={organization.name || 'Organization'}
                />
                <AvatarFallback className="rounded-lg bg-primary text-primary-foreground text-lg font-semibold">
                  {orgInitial}
                </AvatarFallback>
              </Avatar>
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="font-semibold">
            {organization.name}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Future: Add more organizations here */}
      {/* <div className="mt-auto">
        <button className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 text-muted-foreground transition-colors hover:border-muted-foreground/50 hover:text-foreground">
          <IconPlus className="h-5 w-5" />
        </button>
      </div> */}
    </div>
  )
}
