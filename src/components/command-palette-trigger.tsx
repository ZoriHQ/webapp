import { IconSearch } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'

interface CommandPaletteTriggerProps {
  onClick: () => void
  isMobile?: boolean
}

export function CommandPaletteTrigger({
  onClick,
  isMobile = false,
}: CommandPaletteTriggerProps) {
  if (isMobile) {
    return (
      <Button variant="ghost" size="icon" onClick={onClick} className="h-9 w-9">
        <IconSearch className="h-4 w-4" />
        <span className="sr-only">Search</span>
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      onClick={onClick}
      className="w-full max-w-sm justify-between text-muted-foreground hover:text-foreground"
    >
      <div className="flex items-center gap-2">
        <IconSearch className="h-4 w-4" />
        <span className="text-sm">Search...</span>
      </div>
      <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
        <span className="text-xs">⌘</span>K
      </kbd>
    </Button>
  )
}
