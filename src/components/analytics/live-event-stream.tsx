import { useMemo, useState } from 'react'
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
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
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import { EventRow } from '@/components/analytics/event-row'

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
