import { useState } from 'react'
import { Check, Layers, Plus, RefreshCw, Search } from 'lucide-react'
import { FilterChip } from './filter-chip'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

export interface EventFiltersState {
  pages: Array<string>
  traffic_origins: Array<string>
  event_names: Array<string>
  visitor_id?: string
}

interface EventsFilterBarProps {
  filters: EventFiltersState
  availablePages?: Array<string>
  availableOrigins?: Array<string>
  availableEventNames?: Array<string>
  onFiltersChange: (filters: EventFiltersState) => void
  onRefresh?: () => void
  isLoadingOptions?: boolean
  groupBySession?: boolean
  onGroupBySessionChange?: (grouped: boolean) => void
}

export function EventsFilterBar({
  filters,
  availablePages = [],
  availableOrigins = [],
  availableEventNames = [],
  onFiltersChange,
  onRefresh,
  isLoadingOptions = false,
  groupBySession = false,
  onGroupBySessionChange,
}: EventsFilterBarProps) {
  const [openPopover, setOpenPopover] = useState<
    'pages' | 'origins' | 'eventNames' | null
  >(null)

  const togglePage = (page: string) => {
    const newPages = filters.pages.includes(page)
      ? filters.pages.filter((p) => p !== page)
      : [...filters.pages, page]
    onFiltersChange({ ...filters, pages: newPages })
  }

  const toggleOrigin = (origin: string) => {
    const newOrigins = filters.traffic_origins.includes(origin)
      ? filters.traffic_origins.filter((o) => o !== origin)
      : [...filters.traffic_origins, origin]
    onFiltersChange({ ...filters, traffic_origins: newOrigins })
  }

  const toggleEventName = (eventName: string) => {
    const newEventNames = filters.event_names.includes(eventName)
      ? filters.event_names.filter((e) => e !== eventName)
      : [...filters.event_names, eventName]
    onFiltersChange({ ...filters, event_names: newEventNames })
  }

  const removePage = (page: string) => {
    onFiltersChange({
      ...filters,
      pages: filters.pages.filter((p) => p !== page),
    })
  }

  const removeOrigin = (origin: string) => {
    onFiltersChange({
      ...filters,
      traffic_origins: filters.traffic_origins.filter((o) => o !== origin),
    })
  }

  const removeEventName = (eventName: string) => {
    onFiltersChange({
      ...filters,
      event_names: filters.event_names.filter((e) => e !== eventName),
    })
  }

  const setVisitorId = (visitorId: string) => {
    onFiltersChange({ ...filters, visitor_id: visitorId || undefined })
  }

  const removeVisitorId = () => {
    onFiltersChange({ ...filters, visitor_id: undefined })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      pages: [],
      traffic_origins: [],
      event_names: [],
      visitor_id: undefined,
    })
  }

  const hasActiveFilters =
    filters.pages.length > 0 ||
    filters.traffic_origins.length > 0 ||
    filters.event_names.length > 0 ||
    !!filters.visitor_id

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Visitor ID Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Filter by Visitor ID..."
          value={filters.visitor_id || ''}
          onChange={(e) => setVisitorId(e.target.value)}
          className="h-8 w-[200px] pl-9 text-sm"
        />
      </div>

      {/* Pages Filter */}
      <Popover
        open={openPopover === 'pages'}
        onOpenChange={(open) => setOpenPopover(open ? 'pages' : null)}
      >
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 border-dashed">
            <Plus className="mr-2 h-3.5 w-3.5" />
            Pages
            {filters.pages.length > 0 && (
              <span className="ml-2 rounded-full bg-primary px-1.5 py-0.5 text-xs font-semibold text-primary-foreground">
                {filters.pages.length}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search pages..." />
            <CommandList>
              <CommandEmpty>
                {isLoadingOptions ? 'Loading...' : 'No pages found.'}
              </CommandEmpty>
              <CommandGroup>
                {availablePages.map((page) => {
                  const isSelected = filters.pages.includes(page)
                  return (
                    <CommandItem key={page} onSelect={() => togglePage(page)}>
                      <div
                        className={cn(
                          'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'opacity-50 [&_svg]:invisible',
                        )}
                      >
                        <Check className="h-3 w-3" />
                      </div>
                      <span className="truncate font-mono text-xs">{page}</span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Traffic Origins Filter */}
      <Popover
        open={openPopover === 'origins'}
        onOpenChange={(open) => setOpenPopover(open ? 'origins' : null)}
      >
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 border-dashed">
            <Plus className="mr-2 h-3.5 w-3.5" />
            Traffic Sources
            {filters.traffic_origins.length > 0 && (
              <span className="ml-2 rounded-full bg-primary px-1.5 py-0.5 text-xs font-semibold text-primary-foreground">
                {filters.traffic_origins.length}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search sources..." />
            <CommandList>
              <CommandEmpty>
                {isLoadingOptions ? 'Loading...' : 'No sources found.'}
              </CommandEmpty>
              <CommandGroup>
                {availableOrigins.map((origin) => {
                  const isSelected = filters.traffic_origins.includes(origin)
                  return (
                    <CommandItem
                      key={origin}
                      onSelect={() => toggleOrigin(origin)}
                    >
                      <div
                        className={cn(
                          'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'opacity-50 [&_svg]:invisible',
                        )}
                      >
                        <Check className="h-3 w-3" />
                      </div>
                      <span className="truncate text-sm">{origin}</span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Popover
        open={openPopover === 'eventNames'}
        onOpenChange={(open) => setOpenPopover(open ? 'eventNames' : null)}
      >
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 border-dashed">
            <Plus className="mr-2 h-3.5 w-3.5" />
            Events
            {filters.event_names.length > 0 && (
              <span className="ml-2 rounded-full bg-primary px-1.5 py-0.5 text-xs font-semibold text-primary-foreground">
                {filters.event_names.length}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search events..." />
            <CommandList>
              <CommandEmpty>
                {isLoadingOptions ? 'Loading...' : 'No events found.'}
              </CommandEmpty>
              <CommandGroup>
                {availableEventNames.map((eventName) => {
                  const isSelected = filters.event_names.includes(eventName)
                  return (
                    <CommandItem
                      key={eventName}
                      onSelect={() => toggleEventName(eventName)}
                    >
                      <div
                        className={cn(
                          'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'opacity-50 [&_svg]:invisible',
                        )}
                      >
                        <Check className="h-3 w-3" />
                      </div>
                      <span className="truncate font-mono text-xs">
                        {eventName}
                      </span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {filters.visitor_id && (
        <FilterChip
          label="Visitor"
          value={
            filters.visitor_id.substring(0, 12) +
            (filters.visitor_id.length > 12 ? '...' : '')
          }
          onRemove={removeVisitorId}
        />
      )}
      {filters.pages.map((page) => (
        <FilterChip
          key={`page-${page}`}
          label="Page"
          value={page}
          onRemove={() => removePage(page)}
        />
      ))}
      {filters.traffic_origins.map((origin) => (
        <FilterChip
          key={`origin-${origin}`}
          label="Source"
          value={origin}
          onRemove={() => removeOrigin(origin)}
        />
      ))}
      {filters.event_names.map((eventName) => (
        <FilterChip
          key={`event-${eventName}`}
          label="Event"
          value={eventName}
          onRemove={() => removeEventName(eventName)}
        />
      ))}

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAllFilters}
          className="h-8 px-2 text-xs"
        >
          Clear all
        </Button>
      )}

      {/* Spacer to push buttons to the right */}
      <div className="flex-1" />

      {/* Group by Session Toggle */}
      {onGroupBySessionChange && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={groupBySession ? 'default' : 'outline'}
                size="sm"
                onClick={() => onGroupBySessionChange(!groupBySession)}
                className="h-8 gap-2"
              >
                <Layers className="h-4 w-4" />
                <span className="hidden sm:inline">Group by Session</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {groupBySession
                  ? 'Click to show flat list'
                  : 'Click to group events by session'}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Refresh Button */}
      {onRefresh && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                className="h-8 w-8 p-0"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Refresh events</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  )
}
