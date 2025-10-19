import type Zoriapi from 'zorihq'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useVisitorProfile } from '@/hooks/use-analytics'
import { countryCodeToFlag, getCountryName } from '@/lib/country-utils'
import { IconUser, IconClock, IconWorld, IconLink, IconActivity } from '@tabler/icons-react'

interface VisitorProfileModalProps {
  projectId: string
  visitorId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
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

function formatFullDate(timestamp: string) {
  return new Date(timestamp).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
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

export function VisitorProfileModal({
  projectId,
  visitorId,
  open,
  onOpenChange,
}: VisitorProfileModalProps) {
  const { data: profile, isLoading } = useVisitorProfile(projectId, visitorId)

  const countryCode = profile?.location_country_iso?.toUpperCase() || ''
  const countryName = getCountryName(countryCode)
  const flagEmoji = countryCodeToFlag(countryCode)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconUser className="h-5 w-5" />
            Visitor Profile
          </DialogTitle>
          <DialogDescription>
            Detailed information and activity for visitor {visitorId?.substring(0, 12)}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-muted-foreground">Loading profile...</p>
          </div>
        ) : profile ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Side - Profile Info */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold mb-3">Profile Information</h3>
                <div className="space-y-3 rounded-lg border p-4">
                  <div className="flex items-start gap-3">
                    <IconUser className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Visitor ID</p>
                      <p className="text-sm font-mono">{profile.visitor_id}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-start gap-3">
                    <IconWorld className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="text-sm">
                        {flagEmoji} {countryName}
                        {profile.location_city && `, ${profile.location_city}`}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-start gap-3">
                    <IconClock className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">First Seen</p>
                      <p className="text-sm">
                        {profile.first_seen ? formatFullDate(profile.first_seen) : 'N/A'}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-start gap-3">
                    <IconClock className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Last Seen</p>
                      <p className="text-sm">
                        {profile.last_seen ? formatFullDate(profile.last_seen) : 'N/A'}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-start gap-3">
                    <IconActivity className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Total Events</p>
                      <p className="text-sm font-semibold">{profile.total_events || 0}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3">First Visit Information</h3>
                <div className="space-y-3 rounded-lg border p-4">
                  <div className="flex items-start gap-3">
                    <IconLink className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Traffic Origin</p>
                      <p className="text-sm truncate">
                        {profile.first_traffic_origin || 'Direct'}
                      </p>
                    </div>
                  </div>

                  {profile.first_referrer_url && (
                    <>
                      <Separator />
                      <div className="flex items-start gap-3">
                        <IconLink className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground">First Referrer</p>
                          <p className="text-sm truncate">{profile.first_referrer_url}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side - Event List */}
            <div>
              <h3 className="text-sm font-semibold mb-3">
                Event History ({profile.events?.length || 0})
              </h3>
              <div className="rounded-lg border">
                {profile.events && profile.events.length > 0 ? (
                  <div className="max-h-[600px] overflow-y-auto">
                    <Table>
                      <TableHeader className="sticky top-0 bg-background z-10">
                        <TableRow>
                          <TableHead>Event</TableHead>
                          <TableHead>Path</TableHead>
                          <TableHead>Device</TableHead>
                          <TableHead>Time</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {profile.events.map((event, idx) => (
                          <TableRow key={idx}>
                            <TableCell>
                              <Badge variant={getEventBadgeVariant(event.event_name)}>
                                {event.event_name || 'unknown'}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-mono text-xs">
                              {event.page_path || '/'}
                            </TableCell>
                            <TableCell className="text-xs">
                              {event.device_type || 'N/A'}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {event.client_timestamp_utc
                                ? formatTimestamp(event.client_timestamp_utc)
                                : 'N/A'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-12">
                    <p className="text-sm text-muted-foreground">No events found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-muted-foreground">No profile data available</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
