import { IconEdit, IconTrash, IconDots } from '@tabler/icons-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getProviderIcon, getProviderName, getProviderColor } from '@/lib/payment-provider-icons'
import { formatDistanceToNow } from 'date-fns'
import type Zoriapi from 'zorihq'

interface ProviderCardProps {
  provider: Zoriapi.V1.PaymentProviders.PaymentProviderResponse
  onEdit: () => void
  onDelete: () => void
}

export function ProviderCard({ provider, onEdit, onDelete }: ProviderCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        {/* Provider Icon */}
        <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${getProviderColor(provider.provider_type)}`}>
          {getProviderIcon(provider.provider_type, 'h-5 w-5')}
        </div>

        {/* Provider Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm">
              {getProviderName(provider.provider_type)}
            </h3>
            {provider.is_active && (
              <Badge variant="default" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                Active
              </Badge>
            )}
          </div>
          {provider.last_synced_at && (
            <p className="text-xs text-muted-foreground mt-1">
              Last synced {formatDistanceToNow(new Date(provider.last_synced_at), { addSuffix: true })}
            </p>
          )}
        </div>

        {/* Actions Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <IconDots className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <IconEdit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              <IconTrash className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  )
}
