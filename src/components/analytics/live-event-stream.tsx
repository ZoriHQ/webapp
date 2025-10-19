import type Zoriapi from 'zorihq'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { countryCodeToFlag } from '@/lib/country-utils'

interface LiveEventStreamProps {
  events: Zoriapi.V1.Analytics.RecentEvent[] | undefined
  isLoading: boolean
  onVisitorClick?: (visitorId: string) => void
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

function getEventBadgeVariant(eventName: string | undefined): 'default' | 'secondary' | 'destructive' | 'outline' {
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

export function LiveEventStream({ events, isLoading, onVisitorClick }: LiveEventStreamProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Event Stream</CardTitle>
        <CardDescription>Real-time visitor activity on your site</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-muted-foreground">Loading events...</p>
          </div>
        ) : events && events.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Visitor</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Path</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Browser</TableHead>
                  <TableHead className="text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event, idx) => {
                  const countryCode = event.location_country_iso?.toUpperCase() || ''
                  const flagEmoji = countryCodeToFlag(countryCode)

                  return (
                    <TableRow key={idx}>
                      <TableCell className="font-mono text-xs">
                        {event.visitor_id ? (
                          <button
                            onClick={() => onVisitorClick?.(event.visitor_id!)}
                            className="hover:text-primary hover:underline cursor-pointer transition-colors"
                          >
                            {event.visitor_id.substring(0, 12)}
                          </button>
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getEventBadgeVariant(event.event_name)}>
                          {event.event_name || 'unknown'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {event.page_path || '/'}
                      </TableCell>
                      <TableCell>
                        {countryCode ? (
                          <span className="flex items-center gap-1">
                            <span>{flagEmoji}</span>
                            <span>{countryCode}</span>
                          </span>
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                      <TableCell>{event.device_type || 'N/A'}</TableCell>
                      <TableCell>{event.browser_name || 'N/A'}</TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {event.client_timestamp_utc
                          ? formatTimestamp(event.client_timestamp_utc)
                          : 'N/A'}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-sm text-muted-foreground">
              No events recorded yet
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
