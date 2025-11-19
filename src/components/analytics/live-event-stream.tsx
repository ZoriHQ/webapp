import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
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
import { countryCodeToFlag } from '@/lib/country-utils'

interface LiveEventStreamProps {
  events: Array<Zoriapi.V1.Analytics.RecentEvent> | undefined
  isLoading: boolean
  onVisitorClick?: (visitorId: string) => void
  onFilterByVisitor?: (visitorId: string) => void
  onFilterByEvent?: (eventName: string) => void
  total?: number
  limit?: number
  offset?: number
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

function getEventBadgeVariant(
  eventName: string | undefined,
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (eventName) {
    case 'page_view':
      return 'default'
    case 'page_unload':
      return 'destructive'
    case 'page_hidden':
      return 'outline'
    default:
      return 'secondary'
  }
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
}: LiveEventStreamProps) {
  const navigate = useNavigate()

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

  return (
    <Card>
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-sm text-muted-foreground">Loading events...</p>
        </div>
      ) : events && events.length > 0 ? (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Visitor</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Path</TableHead>
                  <TableHead>Referrer</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Browser</TableHead>
                  <TableHead className="text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event, idx) => {
                  const countryCode =
                    event.location_country_iso?.toUpperCase() || ''
                  const flagEmoji = countryCodeToFlag(countryCode)

                  return (
                    <TableRow key={idx}>
                      <TableCell className="font-mono text-xs">
                        {event.visitor_id ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                onVisitorClick?.(event.visitor_id!)
                              }
                              className="hover:text-primary hover:underline cursor-pointer transition-colors"
                            >
                              {event.visitor_id.substring(0, 12)}
                            </button>
                            {onFilterByVisitor && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      onClick={() =>
                                        onFilterByVisitor(event.visitor_id!)
                                      }
                                      className="text-muted-foreground hover:text-primary transition-colors"
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
                          </div>
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {event.user_id || event.external_id ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="text-muted-foreground cursor-help">
                                  {(
                                    event.user_id || event.external_id
                                  )?.substring(0, 12)}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                {event.user_id && (
                                  <p>User ID: {event.user_id}</p>
                                )}
                                {event.external_id && (
                                  <p>External ID: {event.external_id}</p>
                                )}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={getEventBadgeVariant(event.event_name)}
                          >
                            {event.event_name || 'unknown'}
                          </Badge>
                          {onFilterByEvent && event.event_name && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    onClick={() =>
                                      onFilterByEvent(event.event_name!)
                                    }
                                    className="text-muted-foreground hover:text-primary transition-colors"
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
                      <TableCell className="font-mono text-xs max-w-[200px]">
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
                      <TableCell className="text-xs max-w-[150px]">
                        {event.referrer_domain ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="truncate block cursor-help text-muted-foreground">
                                  {event.referrer_domain}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-[400px]">
                                {event.referrer_url && (
                                  <p className="break-all">
                                    {event.referrer_url}
                                  </p>
                                )}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {countryCode || event.location_city ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="flex items-center gap-1 cursor-help">
                                  {flagEmoji && <span>{flagEmoji}</span>}
                                  <span>{countryCode || '—'}</span>
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                {event.location_city && (
                                  <p>City: {event.location_city}</p>
                                )}
                                {event.location_latitude &&
                                  event.location_longitude && (
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
                      <TableCell className="text-xs">
                        {event.device_type || (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs">
                        {event.browser_name || (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">
                        {event.client_timestamp_utc
                          ? formatTimestamp(event.client_timestamp_utc)
                          : '—'}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          {total > limit && (
            <div className="flex items-center justify-between px-2 py-4">
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
