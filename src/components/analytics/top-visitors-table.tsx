import { IconUserCheck, IconUsers } from '@tabler/icons-react'

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
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { countryCodeToFlag } from '@/lib/country-utils'
import {
  formatCompactNumber,
  formatCurrency,
  formatDuration,
  generateAvatarFromHash,
} from '@/lib/utils'
import { useTopVisitors } from '@/hooks/use-analytics'
import { useAppContext } from '@/contexts/app.context'

interface TopVisitorsTableProps {
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

export function TopVisitorsTable({ onVisitorClick }: TopVisitorsTableProps) {
  const { storedValues } = useAppContext()
  const { data, isLoading } = useTopVisitors({
    project_id: storedValues!.projectId!,
    time_range: storedValues!.timeRange,
    limit: 10,
  })

  const hasVisitors = data?.visitors && data.visitors.length > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Active Visitors</CardTitle>
        <CardDescription>
          Most active visitors by event count with revenue metrics
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-muted-foreground">
              Loading top visitors...
            </p>
          </div>
        ) : hasVisitors ? (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Events</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Payments</TableHead>
                  <TableHead>Time to Purchase</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>First Seen</TableHead>
                  <TableHead>Last Seen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.visitors!.map((visitor, idx) => {
                  const countryCode =
                    visitor.location_country_iso?.toUpperCase() || ''
                  const flagEmoji = countryCodeToFlag(countryCode)
                  const hasIdentity = visitor.user_id || visitor.external_id
                  const isGrouped = visitor.is_grouped === true
                  const visitorCount = visitor.visitor_ids?.length || 1
                  const hasRevenue = (visitor.total_revenue || 0) > 0

                  // Use the first visitor_id for navigation, or fallback to visitor_id field
                  const primaryVisitorId =
                    visitor.visitor_ids?.[0] || visitor.user_id || ''

                  // Generate avatar based on the most identifiable info
                  const avatarSeed =
                    visitor.name ||
                    visitor.email ||
                    visitor.user_id ||
                    visitor.external_id ||
                    primaryVisitorId
                  const avatar = generateAvatarFromHash(avatarSeed)

                  return (
                    <TableRow key={idx} className="h-16">
                      <TableCell className="py-3">
                        {primaryVisitorId ? (
                          <button
                            onClick={() => onVisitorClick?.(primaryVisitorId)}
                            className="hover:text-primary cursor-pointer transition-colors text-left w-full"
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative flex-shrink-0">
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback
                                    style={{
                                      backgroundColor: avatar.backgroundColor,
                                      color: avatar.textColor,
                                    }}
                                    className="text-sm font-semibold"
                                  >
                                    {avatar.initials}
                                  </AvatarFallback>
                                </Avatar>
                                {isGrouped && (
                                  <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-0.5">
                                    <IconUsers className="h-3 w-3 text-white" />
                                  </div>
                                )}
                                {!isGrouped && hasIdentity && (
                                  <div className="absolute -bottom-1 -right-1 bg-green-600 rounded-full p-0.5">
                                    <IconUserCheck className="h-3 w-3 text-white" />
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-col min-w-0">
                                {visitor.name ? (
                                  <>
                                    <span className="text-sm font-medium truncate">
                                      {visitor.name}
                                    </span>
                                    {visitor.email && (
                                      <span className="text-xs text-muted-foreground truncate">
                                        {visitor.email}
                                      </span>
                                    )}
                                  </>
                                ) : visitor.user_id ? (
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
                                ) : visitor.email ? (
                                  <span className="text-sm font-medium truncate">
                                    {visitor.email}
                                  </span>
                                ) : visitor.external_id ? (
                                  <span className="text-sm font-medium font-mono truncate">
                                    {visitor.external_id}
                                  </span>
                                ) : (
                                  <span className="text-xs font-mono text-muted-foreground truncate">
                                    {primaryVisitorId.substring(0, 12)}...
                                  </span>
                                )}
                                {isGrouped && visitorCount > 1 && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs w-fit mt-1"
                                  >
                                    {visitorCount} visitors
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </button>
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                      <TableCell className="py-3">
                        <span className="font-semibold">
                          {formatCompactNumber(visitor.event_count)}
                        </span>
                      </TableCell>
                      <TableCell className="py-3">
                        {hasRevenue ? (
                          <span className="font-semibold text-green-700 dark:text-green-400">
                            {formatCurrency(
                              visitor.total_revenue,
                              visitor.currency,
                            )}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="py-3">
                        {visitor.distinct_payments ? (
                          <span>{visitor.distinct_payments}</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs py-3">
                        {visitor.time_to_first_purchase_seconds ? (
                          <span>
                            {formatDuration(
                              visitor.time_to_first_purchase_seconds,
                            )}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="py-3">
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
                      <TableCell className="text-xs py-3">
                        {visitor.device_type || 'N/A'}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground py-3">
                        {formatTimestamp(visitor.first_seen)}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground py-3">
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
