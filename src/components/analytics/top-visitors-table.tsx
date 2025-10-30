import { IconUserCheck } from '@tabler/icons-react'
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
                  <TableHead>Customer</TableHead>
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
                  const hasIdentity = visitor.user_id || visitor.external_id

                  return (
                    <TableRow key={idx}>
                      <TableCell>
                        {visitor.visitor_id ? (
                          <button
                            onClick={() => onVisitorClick?.(visitor.visitor_id!)}
                            className="hover:text-primary hover:underline cursor-pointer transition-colors text-left"
                          >
                            <div className="flex items-center gap-2">
                              {hasIdentity && (
                                <IconUserCheck className="h-4 w-4 text-green-600 flex-shrink-0" />
                              )}
                              <div className="flex flex-col min-w-0">
                                {visitor.user_id ? (
                                  <>
                                    <span className="text-sm font-medium truncate">
                                      {visitor.user_id}
                                    </span>
                                    {visitor.external_id && (
                                      <span className="text-xs text-muted-foreground font-mono truncate">
                                        {visitor.external_id}
                                      </span>
                                    )}
                                  </>
                                ) : visitor.external_id ? (
                                  <span className="text-sm font-medium font-mono truncate">
                                    {visitor.external_id}
                                  </span>
                                ) : (
                                  <span className="text-xs font-mono text-muted-foreground truncate">
                                    {visitor.visitor_id.substring(0, 12)}...
                                  </span>
                                )}
                              </div>
                            </div>
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
