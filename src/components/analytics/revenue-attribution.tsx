import { IconMoodEmpty } from '@tabler/icons-react'
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
import { Button } from '@/components/ui/button'

interface RevenueSource {
  source: string
  visitors: number
  conversions: number
  revenue: number
  averageValue: number
}

interface RevenueAttributionProps {
  revenueData: RevenueSource[]
  hasData?: boolean
  showToggle?: boolean
  onToggle?: () => void
}

export function RevenueAttribution({
  revenueData,
  hasData = true,
  showToggle = false,
  onToggle,
}: RevenueAttributionProps) {
  return (
    <div className="mb-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Revenue Attribution by Traffic Source</CardTitle>
              <CardDescription>
                Track which traffic sources drive the most revenue by connecting
                visitor IDs to payments
              </CardDescription>
            </div>
            {showToggle && onToggle && (
              <Button
                variant="outline"
                size="sm"
                onClick={onToggle}
                className="ml-4"
              >
                Toggle State
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {hasData ? (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Traffic Source</TableHead>
                      <TableHead className="text-right">Visitors</TableHead>
                      <TableHead className="text-right">Conversions</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                      <TableHead className="text-right">Avg. Value</TableHead>
                      <TableHead className="text-right">Conv. Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {revenueData.map((source, idx) => {
                      const conversionRate = (
                        (source.conversions / source.visitors) *
                        100
                      ).toFixed(1)
                      return (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">
                            {source.source}
                          </TableCell>
                          <TableCell className="text-right">
                            {source.visitors.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            {source.conversions}
                          </TableCell>
                          <TableCell className="text-right font-semibold text-green-600 dark:text-green-400">
                            ${source.revenue.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            ${source.averageValue.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant="secondary">{conversionRate}%</Badge>
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
                  unique ID. When you pass this ID to Stripe or LemonSqueezy payment
                  metadata, we automatically attribute the revenue to the customer
                  and their original traffic source. This helps you understand your
                  true ROI.
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
    </div>
  )
}
