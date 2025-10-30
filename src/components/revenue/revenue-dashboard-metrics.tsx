import { DollarSign, ShoppingCart, TrendingUp, Users } from 'lucide-react'
import type Zoriapi from 'zorihq'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface RevenueDashboardMetricsProps {
  data: Zoriapi.V1.Revenue.DashboardResponse | undefined
  isLoading: boolean
}

export function RevenueDashboardMetrics({
  data,
  isLoading,
}: RevenueDashboardMetricsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const totalRevenue = (data?.total_revenue || 0) / 100 // Convert from cents
  const conversionRate = data?.conversion_rate || 0
  const avgOrderValue = (data?.avg_order_value || 0) / 100
  const payingCustomers = data?.paying_customers || 0
  const currency = data?.currency || 'USD'

  const metrics = [
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      iconColor: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-950/30',
    },
    {
      title: 'Conversion Rate',
      value: `${conversionRate.toFixed(2)}%`,
      icon: TrendingUp,
      iconColor: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    },
    {
      title: 'Avg Order Value',
      value: `$${avgOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: ShoppingCart,
      iconColor: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950/30',
    },
    {
      title: 'Paying Customers',
      value: payingCustomers.toLocaleString(),
      icon: Users,
      iconColor: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-950/30',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {metric.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${metric.bgColor}`}>
              <metric.icon className={`h-4 w-4 ${metric.iconColor}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            {metric.title === 'Total Revenue' && currency !== 'USD' && (
              <p className="text-xs text-muted-foreground mt-1">{currency}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
