import { IconMoodEmpty } from '@tabler/icons-react'
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

interface RevenueAttributionByOriginProps {
  data: Zoriapi.V1.Revenue.AttributionByOriginResponse | undefined
  isLoading: boolean
}

export function RevenueAttributionByOrigin({
  data,
  isLoading,
}: RevenueAttributionByOriginProps) {
  const hasData = data?.data && data.data.length > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Attribution by Traffic Source</CardTitle>
        <CardDescription>
          Track which traffic sources drive the most revenue by connecting
          visitor IDs to payments
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-muted-foreground">
              Loading revenue attribution...
            </p>
          </div>
        ) : hasData ? (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Traffic Source</TableHead>
                    <TableHead className="text-right">Visitors</TableHead>
                    <TableHead className="text-right">
                      Paying Customers
                    </TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Avg/Customer</TableHead>
                    <TableHead className="text-right">Conv. Rate</TableHead>
                    <TableHead className="text-right">% of Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.data!.map((source, idx) => {
                    const revenue = (source.total_revenue || 0) / 100
                    const avgRevenue =
                      (source.avg_revenue_per_customer || 0) / 100
                    const conversionRate = source.conversion_rate || 0
                    const revenuePercentage = source.revenue_percentage || 0

                    return (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">
                          {source.origin || 'Direct'}
                        </TableCell>
                        <TableCell className="text-right">
                          {(source.unique_visitors || 0).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {source.paying_customers || 0}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-green-600 dark:text-green-400">
                          $
                          {revenue.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          ${avgRevenue.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="secondary">
                            {conversionRate.toFixed(2)}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge>{revenuePercentage.toFixed(1)}%</Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-dashed">
              <p className="text-sm text-muted-foreground">
                <strong>How it works:</strong> Zori tracks each visitor with a
                unique ID. When you pass this ID to Stripe or LemonSqueezy
                payment metadata, we automatically attribute the revenue to the
                customer and their original traffic source. This helps you
                understand your true ROI.
              </p>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <IconMoodEmpty className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              No Revenue Attributed Yet
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mb-6">
              Start tracking revenue by passing visitor IDs to your payment
              provider's metadata. Once payments are processed, you'll see
              attribution data here.
            </p>
            <div className="p-4 bg-muted/50 rounded-lg border border-dashed max-w-lg">
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Quick Setup:</strong>
              </p>
              <ol className="text-sm text-muted-foreground text-left space-y-1 list-decimal list-inside">
                <li>Install the Zori tracking script on your website</li>
                <li>
                  Get the visitor ID from{' '}
                  <code className="px-1 py-0.5 bg-background rounded text-xs">
                    zori.getVisitorId()
                  </code>
                </li>
                <li>
                  Pass it to Stripe or LemonSqueezy metadata during checkout
                </li>
                <li>
                  Revenue will automatically appear here once payments are
                  processed
                </li>
              </ol>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
