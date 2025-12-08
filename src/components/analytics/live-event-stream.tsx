import { useMemo, useState } from 'react'
import {
  Braces,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  Copy,
  Globe,
  Search,
} from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import type Zoriapi from 'zorihq'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import { countryCodeToFlag } from '@/lib/country-utils'
import { getPlatformDisplay } from '@/lib/platform-icons'
import { EventBadge } from '@/lib/click-event-utils'
import { cn } from '@/lib/utils'

interface LiveEventStreamProps {
  events: Array<Zoriapi.V1.Analytics.RecentEvent> | undefined
  isLoading: boolean
  onVisitorClick?: (visitorId: string) => void
  onFilterByVisitor?: (visitorId: string) => void
  onFilterByEvent?: (eventName: string) => void
  total?: number
  limit?: number
  offset?: number
  groupBySession?: boolean
}

interface SessionGroup {
  sessionId: string
  events: Array<Zoriapi.V1.Analytics.RecentEvent>
  startTime: string
  endTime: string
  duration: number // in seconds
  eventCount: number
  firstPage: string
  visitorId: string
}

function formatTimestamp(timestamp: string) {
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

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  if (mins < 60) return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`
  const hours = Math.floor(mins / 60)
  const remainingMins = mins % 60
  return `${hours}h ${remainingMins}m`
}

function groupEventsBySession(
  events: Array<Zoriapi.V1.Analytics.RecentEvent>,
): Array<SessionGroup> {
  const sessionMap = new Map<string, Array<Zoriapi.V1.Analytics.RecentEvent>>()

  // Group events by session_id
  events.forEach((event) => {
    const sessionId = event.session_id || `no-session-${event.visitor_id}`
    if (!sessionMap.has(sessionId)) {
      sessionMap.set(sessionId, [])
    }
    sessionMap.get(sessionId)!.push(event)
  })

  // Convert to SessionGroup array
  const groups: Array<SessionGroup> = []
  sessionMap.forEach((sessionEvents, sessionId) => {
    // Sort events by timestamp (newest first within session)
    const sortedEvents = [...sessionEvents].sort((a, b) => {
      const timeA = a.client_timestamp_utc
        ? new Date(a.client_timestamp_utc).getTime()
        : 0
      const timeB = b.client_timestamp_utc
        ? new Date(b.client_timestamp_utc).getTime()
        : 0
      return timeB - timeA
    })

    const startTime =
      sortedEvents[sortedEvents.length - 1]?.client_timestamp_utc || ''
    const endTime = sortedEvents[0]?.client_timestamp_utc || ''

    const duration =
      startTime && endTime
        ? Math.floor(
            (new Date(endTime).getTime() - new Date(startTime).getTime()) /
              1000,
          )
        : 0

    groups.push({
      sessionId,
      events: sortedEvents,
      startTime,
      endTime,
      duration,
      eventCount: sortedEvents.length,
      firstPage: sortedEvents[sortedEvents.length - 1]?.page_path || '/',
      visitorId: sortedEvents[0]?.visitor_id || '',
    })
  })

  // Sort groups by most recent event
  groups.sort((a, b) => {
    const timeA = a.endTime ? new Date(a.endTime).getTime() : 0
    const timeB = b.endTime ? new Date(b.endTime).getTime() : 0
    return timeB - timeA
  })

  return groups
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

function EventRow({
  event,
  onVisitorClick,
  onFilterByVisitor,
  onFilterByEvent,
  showSessionConnector = false,
  isFirstInSession = false,
  isLastInSession = false,
  isOnlyInSession = false,
}: {
  event: Zoriapi.V1.Analytics.RecentEvent
  onVisitorClick?: (visitorId: string) => void
  onFilterByVisitor?: (visitorId: string) => void
  onFilterByEvent?: (eventName: string) => void
  showSessionConnector?: boolean
  isFirstInSession?: boolean
  isLastInSession?: boolean
  isOnlyInSession?: boolean
}) {
  const countryCode = event.location_country_iso?.toUpperCase() || ''
  const flagEmoji = countryCodeToFlag(countryCode)
  const platform = getPlatformDisplay(
    event.browser_name,
    event.os_name,
    event.device_type,
  )

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
          ? formatTimestamp(event.client_timestamp_utc)
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

function SessionHeader({
  session,
  isOpen,
  onToggle,
  onVisitorClick,
}: {
  session: SessionGroup
  isOpen: boolean
  onToggle: () => void
  onVisitorClick?: (visitorId: string) => void
}) {
  const isRealSession = !session.sessionId.startsWith('no-session-')

  return (
    <TableRow
      className="bg-muted/30 hover:bg-muted/50 cursor-pointer"
      onClick={onToggle}
    >
      <TableCell className="w-6 p-0 relative">
        <div className="flex items-center justify-center h-full">
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </TableCell>
      <TableCell colSpan={8}>
        <div className="flex items-center gap-4">
          {isRealSession ? (
            <Badge variant="secondary" className="font-mono text-xs">
              Session: {session.sessionId.substring(0, 8)}
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs">
              No Session
            </Badge>
          )}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{formatDuration(session.duration)}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {session.eventCount} event{session.eventCount !== 1 ? 's' : ''}
          </span>
          <span className="text-xs text-muted-foreground font-mono">
            Started: {session.firstPage}
          </span>
          {session.visitorId && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onVisitorClick?.(session.visitorId)
              }}
              className="text-xs text-primary hover:underline"
            >
              View Visitor
            </button>
          )}
        </div>
      </TableCell>
    </TableRow>
  )
}

export function LiveEventStream({
  events,
  isLoading,
  onVisitorClick,
  onFilterByVisitor,
  onFilterByEvent,
  total = 0,
  limit = 100,
  offset = 0,
  groupBySession = false,
}: LiveEventStreamProps) {
  const navigate = useNavigate()
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(
    new Set(),
  )

  const sessionGroups = useMemo(() => {
    if (!events || !groupBySession) return []
    return groupEventsBySession(events)
  }, [events, groupBySession])

  const currentPage = Math.floor(offset / limit) + 1
  const totalPages = Math.ceil(total / limit)
  const hasNextPage = offset + limit < total
  const hasPrevPage = offset > 0

  const handleNextPage = () => {
    if (hasNextPage) {
      navigate({
        to: '.',
        search: (prev) => ({
          ...prev,
          offset: offset + limit,
        }),
      })
    }
  }

  const handlePrevPage = () => {
    if (hasPrevPage) {
      navigate({
        to: '.',
        search: (prev) => ({
          ...prev,
          offset: Math.max(0, offset - limit),
        }),
      })
    }
  }

  const toggleSession = (sessionId: string) => {
    setExpandedSessions((prev) => {
      const next = new Set(prev)
      if (next.has(sessionId)) {
        next.delete(sessionId)
      } else {
        next.add(sessionId)
      }
      return next
    })
  }

  return (
    <Card>
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-sm text-muted-foreground">Loading events...</p>
        </div>
      ) : events && events.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                {groupBySession && <TableHead className="w-6" />}
                <TableHead className="w-[100px]">Time</TableHead>
                <TableHead>Visitor</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Page</TableHead>
                <TableHead className="w-[120px]">Host</TableHead>
                <TableHead className="w-[80px]">Platform</TableHead>
                <TableHead className="w-[80px]">Location</TableHead>
                <TableHead className="w-[100px]">Source</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupBySession
                ? sessionGroups.map((session) => {
                    const isExpanded = expandedSessions.has(session.sessionId)
                    return (
                      <Collapsible
                        key={session.sessionId}
                        open={isExpanded}
                        asChild
                      >
                        <>
                          <SessionHeader
                            session={session}
                            isOpen={isExpanded}
                            onToggle={() => toggleSession(session.sessionId)}
                            onVisitorClick={onVisitorClick}
                          />
                          <CollapsibleContent asChild>
                            <>
                              {session.events.map((event, idx) => (
                                <EventRow
                                  key={`${session.sessionId}-${idx}`}
                                  event={event}
                                  onVisitorClick={onVisitorClick}
                                  onFilterByVisitor={onFilterByVisitor}
                                  onFilterByEvent={onFilterByEvent}
                                  showSessionConnector={true}
                                  isFirstInSession={idx === 0}
                                  isLastInSession={
                                    idx === session.events.length - 1
                                  }
                                  isOnlyInSession={session.events.length === 1}
                                />
                              ))}
                            </>
                          </CollapsibleContent>
                        </>
                      </Collapsible>
                    )
                  })
                : events.map((event, idx) => (
                    <EventRow
                      key={idx}
                      event={event}
                      onVisitorClick={onVisitorClick}
                      onFilterByVisitor={onFilterByVisitor}
                      onFilterByEvent={onFilterByEvent}
                    />
                  ))}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          {total > limit && (
            <div className="flex items-center justify-between px-4 py-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {offset + 1} to {Math.min(offset + limit, total)} of{' '}
                {total} events
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevPage}
                  disabled={!hasPrevPage}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={!hasNextPage}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-sm text-muted-foreground">
            No events recorded yet
          </p>
        </div>
      )}
    </Card>
  )
}
