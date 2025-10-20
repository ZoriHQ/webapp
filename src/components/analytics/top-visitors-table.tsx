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
import { countryCodeToFlag } from '@/lib/country-utils'

interface TopVisitorsTableProps {
  data: Zoriapi.V1.Analytics.TopVisitorsResponse | undefined
  isLoading: boolean
  onVisitorClick?: (visitorId: string) => void
}

function formatTimestamp(timestamp: string | undefined) {
  if (!timestamp) return 'N/A'
  const date = new Date(timestamp)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function TopVisitorsTable({ data, isLoading, onVisitorClick }: TopVisitorsTableProps) {
  const hasVisitors = data?.visitors && data.visitors.length > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Active Visitors</CardTitle>
        <CardDescription>
          Most active visitors by event count
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-muted-foreground">Loading top visitors...</p>
          </div>
        ) : hasVisitors ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Visitor ID</TableHead>
                  <TableHead>Events</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Browser</TableHead>
                  <TableHead>First Seen</TableHead>
                  <TableHead>Last Seen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.visitors!.map((visitor, idx) => {
                  const countryCode = visitor.location_country_iso?.toUpperCase() || ''
                  const flagEmoji = countryCodeToFlag(countryCode)

                  return (
                    <TableRow key={idx}>
                      <TableCell className="font-mono text-xs">
                        {visitor.visitor_id ? (
                          <button
                            onClick={() => onVisitorClick?.(visitor.visitor_id!)}
                            className="hover:text-primary hover:underline cursor-pointer transition-colors"
                          >
                            {visitor.visitor_id.substring(0, 12)}
                          </button>
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold">
                          {visitor.event_count?.toLocaleString() || 0}
                        </span>
                      </TableCell>
                      <TableCell>
                        {countryCode ? (
                          <div className="flex items-center gap-2">
                            <span>{flagEmoji}</span>
                            <div className="flex flex-col">
                              <span className="text-xs">{countryCode}</span>
                              {visitor.location_city && (
                                <span className="text-xs text-muted-foreground">
                                  {visitor.location_city}
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                      <TableCell className="text-xs">
                        {visitor.device_type || 'N/A'}
                      </TableCell>
                      <TableCell className="text-xs">
                        {visitor.browser_name || 'N/A'}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatTimestamp(visitor.first_seen)}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatTimestamp(visitor.last_seen)}
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
              No visitor data available for this time period
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
