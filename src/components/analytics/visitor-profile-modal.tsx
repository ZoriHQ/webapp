import { useState } from 'react'
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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useVisitorProfile, useIdentifyVisitor } from '@/hooks/use-analytics'
import { countryCodeToFlag, getCountryName } from '@/lib/country-utils'
import { IconUser, IconClock, IconWorld, IconLink, IconActivity, IconUserCheck, IconUserPlus, IconMail, IconPhone, IconId } from '@tabler/icons-react'
import { toast } from 'sonner'

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
  const identifyVisitor = useIdentifyVisitor(projectId)

  const [showIdentifyForm, setShowIdentifyForm] = useState(false)
  const [identifyData, setIdentifyData] = useState({
    name: '',
    email: '',
    phone: '',
    user_id: '',
    external_id: '',
  })

  const countryCode = profile?.location_country_iso?.toUpperCase() || ''
  const countryName = getCountryName(countryCode)
  const flagEmoji = countryCodeToFlag(countryCode)

  const handleIdentify = async () => {
    if (!visitorId) return

    // Filter out empty values
    const data: Record<string, string> = {}
    if (identifyData.name) data.name = identifyData.name
    if (identifyData.email) data.email = identifyData.email
    if (identifyData.phone) data.phone = identifyData.phone
    if (identifyData.user_id) data.user_id = identifyData.user_id
    if (identifyData.external_id) data.external_id = identifyData.external_id

    if (Object.keys(data).length === 0) {
      toast.error('Please fill in at least one field')
      return
    }

    try {
      await identifyVisitor.mutateAsync({
        visitor_id: visitorId,
        ...data,
      })
      toast.success('Customer identified successfully')
      setShowIdentifyForm(false)
      setIdentifyData({ name: '', email: '', phone: '', user_id: '', external_id: '' })
    } catch (error) {
      toast.error('Failed to identify customer')
      console.error('Identification error:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {profile?.is_identified ? (
              <>
                <IconUserCheck className="h-5 w-5 text-green-600" />
                Customer Profile
              </>
            ) : (
              <>
                <IconUser className="h-5 w-5" />
                Visitor Profile
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {profile?.is_identified ? (
              <span>Identified customer information and activity</span>
            ) : (
              <span className="font-mono text-xs select-all">Visitor ID: {visitorId}</span>
            )}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-muted-foreground">Loading profile...</p>
          </div>
        ) : profile ? (
          <div className="space-y-6">
            {/* Identification Status & Info - Top Section */}
            {profile.is_identified && (
              <div className="rounded-lg border border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-900 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <IconUserCheck className="h-5 w-5 text-green-600" />
                  <h3 className="text-sm font-semibold text-green-900 dark:text-green-100">
                    Identified Customer
                  </h3>
                  <Badge variant="outline" className="ml-auto border-green-600 text-green-700 dark:text-green-300">
                    Identified
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.name && (
                    <div className="flex items-start gap-3">
                      <IconUser className="h-4 w-4 text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-green-700 dark:text-green-300">Name</p>
                        <p className="text-sm font-medium text-green-900 dark:text-green-100">{profile.name}</p>
                      </div>
                    </div>
                  )}
                  {profile.email && (
                    <div className="flex items-start gap-3">
                      <IconMail className="h-4 w-4 text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-green-700 dark:text-green-300">Email</p>
                        <p className="text-sm font-medium text-green-900 dark:text-green-100">{profile.email}</p>
                      </div>
                    </div>
                  )}
                  {profile.phone && (
                    <div className="flex items-start gap-3">
                      <IconPhone className="h-4 w-4 text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-green-700 dark:text-green-300">Phone</p>
                        <p className="text-sm font-medium text-green-900 dark:text-green-100">{profile.phone}</p>
                      </div>
                    </div>
                  )}
                  {profile.user_id && (
                    <div className="flex items-start gap-3">
                      <IconId className="h-4 w-4 text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-green-700 dark:text-green-300">User ID</p>
                        <p className="text-sm font-medium font-mono text-green-900 dark:text-green-100 select-all">{profile.user_id}</p>
                      </div>
                    </div>
                  )}
                  {profile.external_id && (
                    <div className="flex items-start gap-3">
                      <IconId className="h-4 w-4 text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-green-700 dark:text-green-300">External ID</p>
                        <p className="text-sm font-medium font-mono text-green-900 dark:text-green-100 select-all">{profile.external_id}</p>
                      </div>
                    </div>
                  )}
                </div>
                {profile.first_identified_at && (
                  <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-900">
                    <p className="text-xs text-green-700 dark:text-green-300">
                      First identified: {formatFullDate(profile.first_identified_at)}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Manual Identification Section */}
            {!profile.is_identified && (
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <IconUserPlus className="h-5 w-5" />
                    <h3 className="text-sm font-semibold">Identify Customer</h3>
                  </div>
                  <Button
                    size="sm"
                    variant={showIdentifyForm ? 'outline' : 'default'}
                    onClick={() => setShowIdentifyForm(!showIdentifyForm)}
                  >
                    {showIdentifyForm ? 'Cancel' : 'Identify'}
                  </Button>
                </div>
                {showIdentifyForm && (
                  <div className="space-y-4 pt-3 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={identifyData.name}
                          onChange={(e) => setIdentifyData({ ...identifyData, name: e.target.value })}
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={identifyData.email}
                          onChange={(e) => setIdentifyData({ ...identifyData, email: e.target.value })}
                          placeholder="john@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={identifyData.phone}
                          onChange={(e) => setIdentifyData({ ...identifyData, phone: e.target.value })}
                          placeholder="+1234567890"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="user_id">User ID</Label>
                        <Input
                          id="user_id"
                          value={identifyData.user_id}
                          onChange={(e) => setIdentifyData({ ...identifyData, user_id: e.target.value })}
                          placeholder="user_123"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="external_id">External ID</Label>
                        <Input
                          id="external_id"
                          value={identifyData.external_id}
                          onChange={(e) => setIdentifyData({ ...identifyData, external_id: e.target.value })}
                          placeholder="ext_123"
                        />
                      </div>
                    </div>
                    <Button
                      onClick={handleIdentify}
                      disabled={identifyVisitor.isPending}
                      className="w-full"
                    >
                      {identifyVisitor.isPending ? 'Saving...' : 'Save Customer Information'}
                    </Button>
                  </div>
                )}
              </div>
            )}

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
                        <p className="text-sm font-mono select-all">{profile.visitor_id}</p>
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
