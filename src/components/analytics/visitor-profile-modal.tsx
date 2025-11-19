import { useState } from 'react'
import {
  IconActivity,
  IconClock,
  IconId,
  IconLink,
  IconMail,
  IconPhone,
  IconUser,
  IconUserCheck,
  IconUserPlus,
  IconWorld,
} from '@tabler/icons-react'
import { DollarSign, ShoppingCart, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'
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
import {
  useIdentifyVisitor,
  useRecentEvents,
  useVisitorProfile,
} from '@/hooks/use-analytics'
import { useCustomerProfile } from '@/hooks/use-revenue'
import { countryCodeToFlag, getCountryName } from '@/lib/country-utils'
import { formatFullDate, formatTimestamp } from '@/lib/utils'
import { getTrafficOriginDisplay } from '@/lib/traffic-origin-utils'

interface VisitorProfileModalProps {
  projectId: string
  visitorId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
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

export function VisitorProfileModal({
  projectId,
  visitorId,
  open,
  onOpenChange,
}: VisitorProfileModalProps) {
  const { data: profile, isLoading } = useVisitorProfile(projectId, visitorId)
  const { data: customerProfile, isLoading: isLoadingRevenue } =
    useCustomerProfile(projectId, visitorId)
  const { data: visitorEvents, isLoading: eventsLoading } = useRecentEvents({
    project_id: projectId,
    visitor_id: visitorId as string,
    time_range: 'today',
    limit: 100,
    offset: 0,
  })
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
      setIdentifyData({
        name: '',
        email: '',
        phone: '',
        user_id: '',
        external_id: '',
      })
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
              <span className="font-mono text-xs select-all">
                Visitor ID: {visitorId}
              </span>
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
                  <Badge
                    variant="outline"
                    className="ml-auto border-green-600 text-green-700 dark:text-green-300"
                  >
                    Identified
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.name && (
                    <div className="flex items-start gap-3">
                      <IconUser className="h-4 w-4 text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-green-700 dark:text-green-300">
                          Name
                        </p>
                        <p className="text-sm font-medium text-green-900 dark:text-green-100">
                          {profile.name}
                        </p>
                      </div>
                    </div>
                  )}
                  {profile.email && (
                    <div className="flex items-start gap-3">
                      <IconMail className="h-4 w-4 text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-green-700 dark:text-green-300">
                          Email
                        </p>
                        <p className="text-sm font-medium text-green-900 dark:text-green-100">
                          {profile.email}
                        </p>
                      </div>
                    </div>
                  )}
                  {profile.phone && (
                    <div className="flex items-start gap-3">
                      <IconPhone className="h-4 w-4 text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-green-700 dark:text-green-300">
                          Phone
                        </p>
                        <p className="text-sm font-medium text-green-900 dark:text-green-100">
                          {profile.phone}
                        </p>
                      </div>
                    </div>
                  )}
                  {profile.user_id && (
                    <div className="flex items-start gap-3">
                      <IconId className="h-4 w-4 text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-green-700 dark:text-green-300">
                          User ID
                        </p>
                        <p className="text-sm font-medium font-mono text-green-900 dark:text-green-100 select-all">
                          {profile.user_id}
                        </p>
                      </div>
                    </div>
                  )}
                  {profile.external_id && (
                    <div className="flex items-start gap-3">
                      <IconId className="h-4 w-4 text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-green-700 dark:text-green-300">
                          External ID
                        </p>
                        <p className="text-sm font-medium font-mono text-green-900 dark:text-green-100 select-all">
                          {profile.external_id}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                {profile.first_identified_at && (
                  <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-900">
                    <p className="text-xs text-green-700 dark:text-green-300">
                      First identified:{' '}
                      {formatFullDate(profile.first_identified_at)}
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
                          onChange={(e) =>
                            setIdentifyData({
                              ...identifyData,
                              name: e.target.value,
                            })
                          }
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={identifyData.email}
                          onChange={(e) =>
                            setIdentifyData({
                              ...identifyData,
                              email: e.target.value,
                            })
                          }
                          placeholder="john@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={identifyData.phone}
                          onChange={(e) =>
                            setIdentifyData({
                              ...identifyData,
                              phone: e.target.value,
                            })
                          }
                          placeholder="+1234567890"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="user_id">User ID</Label>
                        <Input
                          id="user_id"
                          value={identifyData.user_id}
                          onChange={(e) =>
                            setIdentifyData({
                              ...identifyData,
                              user_id: e.target.value,
                            })
                          }
                          placeholder="user_123"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="external_id">External ID</Label>
                        <Input
                          id="external_id"
                          value={identifyData.external_id}
                          onChange={(e) =>
                            setIdentifyData({
                              ...identifyData,
                              external_id: e.target.value,
                            })
                          }
                          placeholder="ext_123"
                        />
                      </div>
                    </div>
                    <Button
                      onClick={handleIdentify}
                      disabled={identifyVisitor.isPending}
                      className="w-full"
                    >
                      {identifyVisitor.isPending
                        ? 'Saving...'
                        : 'Save Customer Information'}
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Revenue Information - Always show, even if $0 */}
            {!isLoadingRevenue && customerProfile && (
              <div className="rounded-lg border border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-900 p-4">
                <h3 className="text-sm font-semibold mb-4 text-green-900 dark:text-green-100">
                  Revenue Summary
                </h3>
                <div className="grid gap-4 sm:grid-cols-3 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/50">
                        <DollarSign className="h-4 w-4 text-green-700 dark:text-green-400" />
                      </div>
                      <span className="text-xs text-green-700 dark:text-green-300">
                        Total Revenue
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                      $
                      {(
                        (customerProfile.total_revenue || 0) / 100
                      ).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/50">
                        <ShoppingCart className="h-4 w-4 text-green-700 dark:text-green-400" />
                      </div>
                      <span className="text-xs text-green-700 dark:text-green-300">
                        Payment Count
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                      {customerProfile.payment_count || 0}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/50">
                        <TrendingUp className="h-4 w-4 text-green-700 dark:text-green-400" />
                      </div>
                      <span className="text-xs text-green-700 dark:text-green-300">
                        Avg Order Value
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                      $
                      {(
                        (customerProfile.avg_order_value || 0) / 100
                      ).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>

                <Separator className="my-4 bg-green-200 dark:bg-green-900" />

                {/* Revenue Attribution */}
                {(customerProfile.payment_count ?? 0) > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-green-900 dark:text-green-100">
                      Revenue Attribution
                    </h4>
                    <div className="space-y-3 rounded-lg border border-green-200 dark:border-green-900 bg-background p-4">
                      {customerProfile.first_payment_date && (
                        <>
                          <div className="flex items-start gap-3">
                            <IconClock className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                              <p className="text-xs text-muted-foreground">
                                First Payment
                              </p>
                              <p className="text-sm font-medium">
                                {format(
                                  new Date(customerProfile.first_payment_date),
                                  'MMM d, yyyy HH:mm',
                                )}
                              </p>
                            </div>
                          </div>
                          <Separator />
                        </>
                      )}

                      {customerProfile.last_payment_date && (
                        <>
                          <div className="flex items-start gap-3">
                            <IconClock className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                              <p className="text-xs text-muted-foreground">
                                Last Payment
                              </p>
                              <p className="text-sm font-medium">
                                {format(
                                  new Date(customerProfile.last_payment_date),
                                  'MMM d, yyyy HH:mm',
                                )}
                              </p>
                            </div>
                          </div>
                          <Separator />
                        </>
                      )}

                      <div className="flex items-start gap-3">
                        <IconLink className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground">
                            Traffic Origin (First Touch)
                          </p>
                          <p className="text-sm font-medium truncate">
                            {getTrafficOriginDisplay(customerProfile)}
                          </p>
                        </div>
                      </div>

                      {customerProfile.first_utm_source && (
                        <>
                          <Separator />
                          <div className="flex items-start gap-3">
                            <IconLink className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-muted-foreground">
                                UTM Source
                              </p>
                              <p className="text-sm font-medium truncate">
                                {customerProfile.first_utm_source}
                              </p>
                            </div>
                          </div>
                        </>
                      )}

                      {customerProfile.first_utm_medium && (
                        <>
                          <Separator />
                          <div className="flex items-start gap-3">
                            <IconLink className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-muted-foreground">
                                UTM Medium
                              </p>
                              <p className="text-sm font-medium truncate">
                                {customerProfile.first_utm_medium}
                              </p>
                            </div>
                          </div>
                        </>
                      )}

                      {customerProfile.first_utm_campaign && (
                        <>
                          <Separator />
                          <div className="flex items-start gap-3">
                            <IconLink className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-muted-foreground">
                                UTM Campaign
                              </p>
                              <p className="text-sm font-medium truncate">
                                {customerProfile.first_utm_campaign}
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Payment History */}
                {customerProfile.payments &&
                  customerProfile.payments.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold mb-2 text-green-900 dark:text-green-100">
                        Payment History
                      </h4>
                      <div className="rounded-md border border-green-200 dark:border-green-900 max-h-[300px] overflow-y-auto">
                        <Table>
                          <TableHeader className="sticky top-0 bg-background z-10">
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Product</TableHead>
                              <TableHead>Provider</TableHead>
                              <TableHead className="text-right">
                                Amount
                              </TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {customerProfile.payments.map((payment, idx) => (
                              <TableRow key={idx}>
                                <TableCell className="text-xs">
                                  {payment.payment_timestamp
                                    ? format(
                                        new Date(payment.payment_timestamp),
                                        'MMM d, yyyy HH:mm',
                                      )
                                    : 'N/A'}
                                </TableCell>
                                <TableCell className="text-sm">
                                  {payment.product_name || 'N/A'}
                                </TableCell>
                                <TableCell className="text-xs">
                                  {payment.provider_type || 'N/A'}
                                </TableCell>
                                <TableCell className="text-right font-semibold text-green-600 dark:text-green-400">
                                  ${((payment.amount || 0) / 100).toFixed(2)}
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant={
                                      payment.status === 'succeeded'
                                        ? 'default'
                                        : 'secondary'
                                    }
                                  >
                                    {payment.status}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Side - Profile Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold mb-3">
                    Profile Information
                  </h3>
                  <div className="space-y-3 rounded-lg border p-4">
                    <div className="flex items-start gap-3">
                      <IconUser className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">
                          Visitor ID
                        </p>
                        <p className="text-sm font-mono select-all">
                          {profile.visitor_id}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-start gap-3">
                      <IconWorld className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">
                          Location
                        </p>
                        <p className="text-sm">
                          {flagEmoji} {countryName}
                          {profile.location_city &&
                            `, ${profile.location_city}`}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-start gap-3">
                      <IconClock className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">
                          First Seen
                        </p>
                        <p className="text-sm">
                          {profile.first_seen
                            ? formatFullDate(profile.first_seen)
                            : 'N/A'}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-start gap-3">
                      <IconClock className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">
                          Last Seen
                        </p>
                        <p className="text-sm">
                          {profile.last_seen
                            ? formatFullDate(profile.last_seen)
                            : 'N/A'}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-start gap-3">
                      <IconActivity className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">
                          Total Events
                        </p>
                        <p className="text-sm font-semibold">
                          {profile.total_events || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-3">
                    First Visit Information
                  </h3>
                  <div className="space-y-3 rounded-lg border p-4">
                    <div className="flex items-start gap-3">
                      <IconLink className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">
                          Traffic Origin
                        </p>
                        <p className="text-sm truncate">
                          {getTrafficOriginDisplay(profile)}
                        </p>
                      </div>
                    </div>

                    {profile.first_referrer_url && (
                      <>
                        <Separator />
                        <div className="flex items-start gap-3">
                          <IconLink className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground">
                              First Referrer
                            </p>
                            <p className="text-sm truncate">
                              {profile.first_referrer_url}
                            </p>
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
                  Event History ({visitorEvents?.events?.length || 0})
                </h3>
                {eventsLoading && <p>Loading...</p>}
                <div className="rounded-lg border">
                  {visitorEvents && visitorEvents.events!.length > 0 ? (
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
                          {visitorEvents.events!.map((event, idx) => (
                            <TableRow key={idx}>
                              <TableCell>
                                <Badge
                                  variant={getEventBadgeVariant(
                                    event.event_name,
                                  )}
                                >
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
                      <p className="text-sm text-muted-foreground">
                        No events found
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-muted-foreground">
              No profile data available
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
