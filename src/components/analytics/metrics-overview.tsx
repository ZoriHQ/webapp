import {
  IconUsers,
  IconCash,
  IconChartBar,
  IconReceipt,
  IconTrendingUp,
  IconPercentage,
} from '@tabler/icons-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface MetricsOverviewProps {
  totalVisitors: number
  totalRevenue: number
  totalConversions: number
  revenuePerVisitor: number
  averageOrderValue: number
  conversionRate: number
}

export function MetricsOverview({
  totalVisitors,
  totalRevenue,
  totalConversions,
  revenuePerVisitor,
  averageOrderValue,
  conversionRate,
}: MetricsOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {/* Total Visitors */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
          <IconUsers className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalVisitors.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Unique visitors tracked
          </p>
        </CardContent>
      </Card>

      {/* Total Revenue */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <IconCash className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            ${totalRevenue.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            From {totalConversions} payments
          </p>
        </CardContent>
      </Card>

      {/* Revenue Per Visitor */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Revenue Per Visitor
          </CardTitle>
          <IconTrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${revenuePerVisitor.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Average value per visitor
          </p>
        </CardContent>
      </Card>

      {/* Number of Payments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
          <IconReceipt className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalConversions}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Successful conversions
          </p>
        </CardContent>
      </Card>

      {/* Average Order Value */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Average Order Value
          </CardTitle>
          <IconChartBar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${averageOrderValue.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Per successful payment
          </p>
        </CardContent>
      </Card>

      {/* Conversion Rate */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          <IconPercentage className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{conversionRate.toFixed(2)}%</div>
          <p className="text-xs text-muted-foreground mt-1">
            Visitors to customers
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
