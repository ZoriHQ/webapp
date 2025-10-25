import { useCustomerProfile } from '@/hooks/use-revenue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DollarSign, ShoppingCart, Calendar, TrendingUp } from 'lucide-react'
import { format } from 'date-fns'

interface CustomerProfileModalProps {
  projectId: string
  visitorId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CustomerProfileModal({
  projectId,
  visitorId,
  open,
  onOpenChange,
}: CustomerProfileModalProps) {
  const { data, isLoading } = useCustomerProfile(projectId, visitorId)

  const totalRevenue = (data?.total_revenue || 0) / 100
  const avgOrderValue = (data?.avg_order_value || 0) / 100
  const paymentCount = data?.payment_count || 0
  const currency = data?.currency || 'USD'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Customer Revenue Profile</DialogTitle>
          <DialogDescription>
            Detailed revenue information and payment history
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-muted-foreground">
              Loading customer profile...
            </p>
          </div>
        ) : data ? (
          <div className="space-y-6">
            {/* Customer Identity */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Customer Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {data.name && (
                  <div>
                    <span className="text-muted-foreground">Name:</span>{' '}
                    <span className="font-medium">{data.name}</span>
                  </div>
                )}
                {data.email && (
                  <div>
                    <span className="text-muted-foreground">Email:</span>{' '}
                    <span className="font-medium">{data.email}</span>
                  </div>
                )}
                {data.user_id && (
                  <div>
                    <span className="text-muted-foreground">User ID:</span>{' '}
                    <span className="font-mono text-xs">{data.user_id}</span>
                  </div>
                )}
                {data.external_id && (
                  <div>
                    <span className="text-muted-foreground">External ID:</span>{' '}
                    <span className="font-mono text-xs">{data.external_id}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Revenue Metrics */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950/30">
                      <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Total Revenue
                    </span>
                  </div>
                  <p className="text-xl font-bold">
                    ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                      <ShoppingCart className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Payment Count
                    </span>
                  </div>
                  <p className="text-xl font-bold">{paymentCount}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/30">
                      <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Avg Order Value
                    </span>
                  </div>
                  <p className="text-xl font-bold">
                    ${avgOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-950/30">
                      <Calendar className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      First Payment
                    </span>
                  </div>
                  <p className="text-sm font-medium">
                    {data.first_payment_date
                      ? format(new Date(data.first_payment_date), 'MMM d, yyyy')
                      : 'N/A'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Attribution */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Attribution</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Traffic Origin:</span>{' '}
                  <span className="font-medium">
                    {data.first_traffic_origin || 'Direct'}
                  </span>
                </div>
                {data.first_utm_source && (
                  <div>
                    <span className="text-muted-foreground">UTM Source:</span>{' '}
                    <span className="font-medium">{data.first_utm_source}</span>
                  </div>
                )}
                {data.first_utm_medium && (
                  <div>
                    <span className="text-muted-foreground">UTM Medium:</span>{' '}
                    <span className="font-medium">{data.first_utm_medium}</span>
                  </div>
                )}
                {data.first_utm_campaign && (
                  <div>
                    <span className="text-muted-foreground">UTM Campaign:</span>{' '}
                    <span className="font-medium">
                      {data.first_utm_campaign}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Payment History */}
            {data.payments && data.payments.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Payment History</h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Provider</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.payments.map((payment, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="text-xs">
                            {payment.payment_timestamp
                              ? format(
                                  new Date(payment.payment_timestamp),
                                  'MMM d, yyyy HH:mm',
                                )
                              : 'N/A'}
                          </TableCell>
                          <TableCell className="text-sm font-medium">
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
        ) : (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-muted-foreground">
              No customer data available
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
