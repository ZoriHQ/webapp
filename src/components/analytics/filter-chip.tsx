import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface FilterChipProps {
  label: string
  value: string
  onRemove: () => void
  className?: string
}

export function FilterChip({
  label,
  value,
  onRemove,
  className,
}: FilterChipProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'flex items-center gap-1.5 pr-1 pl-2.5 py-1 text-sm font-normal hover:bg-accent/50 transition-colors',
        className,
      )}
    >
      <span className="text-muted-foreground text-xs">{label}:</span>
      <span className="font-medium">{value}</span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
        className="ml-0.5 rounded-sm hover:bg-accent p-0.5 transition-colors"
        aria-label={`Remove ${label} filter`}
      >
        <X className="h-3 w-3" />
      </button>
    </Badge>
  )
}
