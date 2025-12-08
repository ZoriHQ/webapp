import { useState } from 'react'
import { Braces, Check, Copy, Globe, Search } from 'lucide-react'
import type Zoriapi from 'zorihq'
import { TableCell, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { countryCodeToFlag } from '@/lib/country-utils'
import { getPlatformDisplay } from '@/lib/platform-icons'
import { EventBadge } from '@/lib/click-event-utils'
import { cn } from '@/lib/utils'

export function formatEventTimestamp(timestamp: string) {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}

function CopyableId({
  id,
  maxLength = 12,
}: {
  id: string
  maxLength?: number
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-1">
      <span className="font-mono text-xs">
        {id.substring(0, maxLength)}
        {id.length > maxLength && '...'}
      </span>
      <button
        onClick={handleCopy}
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        {copied ? (
          <Check className="h-3 w-3 text-green-500" />
        ) : (
          <Copy className="h-3 w-3" />
        )}
      </button>
    </div>
  )
}

function CustomPropertiesIndicator({
  properties,
}: {
  properties: { [key: string]: unknown } | undefined
}) {
  if (!properties || Object.keys(properties).length === 0) return null

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Braces className="h-3 w-3 text-muted-foreground" />
        </TooltipTrigger>
        <TooltipContent className="max-w-[300px]">
          <pre className="text-xs">{JSON.stringify(properties, null, 2)}</pre>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

interface EventRowProps {
  event: Zoriapi.V1.Analytics.RecentEvent
  onVisitorClick?: (visitorId: string) => void
  onFilterByVisitor?: (visitorId: string) => void
  onFilterByEvent?: (eventName: string) => void
  showSessionConnector?: boolean
  isFirstInSession?: boolean
  isLastInSession?: boolean
  isOnlyInSession?: boolean
  compact?: boolean
}

export function EventRow({
  event,
  onVisitorClick,
  onFilterByVisitor,
  onFilterByEvent,
  showSessionConnector = false,
  isFirstInSession = false,
  isLastInSession = false,
  isOnlyInSession = false,
  compact = false,
}: EventRowProps) {
  const countryCode = event.location_country_iso?.toUpperCase() || ''
  const flagEmoji = countryCodeToFlag(countryCode)
  const platform = getPlatformDisplay(
    event.browser_name,
    event.os_name,
    event.device_type,
  )

  if (compact) {
    // Compact version for modal
    return (
      <TableRow className="group">
        {/* Time */}
        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
          {event.client_timestamp_utc
            ? formatEventTimestamp(event.client_timestamp_utc)
            : '—'}
        </TableCell>

        {/* Event */}
        <TableCell>
          <div className="flex items-center gap-2">
            <EventBadge event={event} />
            <CustomPropertiesIndicator properties={event.custom_properties} />
          </div>
        </TableCell>

        {/* Page */}
        <TableCell className="font-mono text-xs max-w-[180px]">
          {event.page_url ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="truncate block cursor-help">
                    {event.page_path || '/'}
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-[400px]">
                  <p className="break-all">{event.page_url}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            event.page_path || '/'
          )}
        </TableCell>

        {/* Platform */}
        <TableCell>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 cursor-help">
                  {platform.browserIcon}
                  {platform.osIcon}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{platform.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </TableCell>

        {/* Location */}
        <TableCell>
          {countryCode || event.location_city ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex items-center gap-1 cursor-help">
                    {flagEmoji && <span>{flagEmoji}</span>}
                    <span className="text-xs">{countryCode || '—'}</span>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  {event.location_city && <p>City: {event.location_city}</p>}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </TableCell>
      </TableRow>
    )
  }

  // Full version for events page
  return (
    <TableRow className="group">
      {/* Session connector column */}
      {showSessionConnector && (
        <TableCell className="w-6 p-0 relative">
          <div className="flex flex-col items-center h-full absolute inset-0">
            {/* Top line */}
            {!isFirstInSession && !isOnlyInSession && (
              <div className="w-0.5 flex-1 bg-border" />
            )}
            {(isFirstInSession || isOnlyInSession) && (
              <div className="flex-1" />
            )}
            {/* Dot */}
            <div
              className={cn(
                'w-2 h-2 rounded-full shrink-0',
                isFirstInSession || isOnlyInSession
                  ? 'bg-primary'
                  : 'bg-muted-foreground/50',
              )}
            />
            {/* Bottom line */}
            {!isLastInSession && !isOnlyInSession && (
              <div className="w-0.5 flex-1 bg-border" />
            )}
            {(isLastInSession || isOnlyInSession) && <div className="flex-1" />}
          </div>
        </TableCell>
      )}

      {/* Time */}
      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
        {event.client_timestamp_utc
          ? formatEventTimestamp(event.client_timestamp_utc)
          : '—'}
      </TableCell>

      {/* Visitor */}
      <TableCell>
        {event.visitor_id ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onVisitorClick?.(event.visitor_id!)}
              className="hover:text-primary hover:underline cursor-pointer transition-colors"
            >
              <CopyableId id={event.visitor_id} />
            </button>
            {onFilterByVisitor && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => onFilterByVisitor(event.visitor_id!)}
                      className="text-muted-foreground hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Search className="h-3 w-3" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Filter by this visitor</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {(event.user_id || event.external_id) && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="text-[10px] px-1 py-0">
                      ID
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    {event.user_id && <p>User: {event.user_id}</p>}
                    {event.external_id && <p>External: {event.external_id}</p>}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </TableCell>

      {/* Event */}
      <TableCell>
        <div className="flex items-center gap-2">
          <EventBadge event={event} />
          <CustomPropertiesIndicator properties={event.custom_properties} />
          {onFilterByEvent && event.event_name && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onFilterByEvent(event.event_name!)}
                    className="text-muted-foreground hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Search className="h-3 w-3" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Filter by this event</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </TableCell>

      {/* Page */}
      <TableCell className="font-mono text-xs max-w-[180px]">
        {event.page_url ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="truncate block cursor-help">
                  {event.page_path || '/'}
                </span>
              </TooltipTrigger>
              <TooltipContent className="max-w-[400px]">
                <p className="break-all">{event.page_url}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          event.page_path || '/'
        )}
      </TableCell>

      {/* Host */}
      <TableCell className="text-xs max-w-[120px]">
        {event.host ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 cursor-help">
                  <Globe className="h-3 w-3 text-muted-foreground shrink-0" />
                  <span className="truncate text-muted-foreground">
                    {event.host.replace(/^www\./, '')}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{event.host}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </TableCell>

      {/* Platform (Browser + OS) */}
      <TableCell>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5 cursor-help">
                {platform.browserIcon}
                {platform.osIcon}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{platform.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>

      {/* Location */}
      <TableCell>
        {countryCode || event.location_city ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="flex items-center gap-1 cursor-help">
                  {flagEmoji && <span>{flagEmoji}</span>}
                  <span className="text-xs">{countryCode || '—'}</span>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                {event.location_city && <p>City: {event.location_city}</p>}
                {event.location_latitude && event.location_longitude && (
                  <p className="text-xs text-muted-foreground">
                    {event.location_latitude.toFixed(4)},{' '}
                    {event.location_longitude.toFixed(4)}
                  </p>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </TableCell>

      {/* Source */}
      <TableCell className="text-xs">
        {event.utm_source ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="text-[10px]">
                  {event.utm_source}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                {event.utm_source && <p>Source: {event.utm_source}</p>}
                {event.utm_medium && <p>Medium: {event.utm_medium}</p>}
                {event.utm_campaign && <p>Campaign: {event.utm_campaign}</p>}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : event.referrer_domain ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="truncate block cursor-help text-muted-foreground max-w-[100px]">
                  {event.referrer_domain}
                </span>
              </TooltipTrigger>
              <TooltipContent className="max-w-[400px]">
                {event.referrer_url && (
                  <p className="break-all">{event.referrer_url}</p>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </TableCell>
    </TableRow>
  )
}
