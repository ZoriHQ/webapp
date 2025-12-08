import { Clock, DollarSign, RefreshCw, TrendingUp, Users } from 'lucide-react'
import type Zoriapi from 'zorihq'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface ConversionMetricsCardProps {
  data: Zoriapi.V1.Revenue.ConversionMetricsResponse | undefined
  isLoading: boolean
}

export function ConversionMetricsCard({
  data,
  isLoading,
}: ConversionMetricsCardProps) {
  const conversionRate = data?.conversion_rate || 0
  const avgTimeToFirstPurchase = data?.avg_time_to_first_purchase_hours || 0
  const customerLifetimeValue = (data?.customer_lifetime_value || 0) / 100
  const repeatPurchaseRate = data?.repeat_purchase_rate || 0
  const payingCustomers = data?.paying_customers || 0
  const totalVisitors = data?.total_visitors || 0

  const metrics = [
    {
      label: 'Conversion Rate',
      value: `${conversionRate.toFixed(2)}%`,
      description: `${payingCustomers} of ${totalVisitors.toLocaleString()} visitors`,
      icon: TrendingUp,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
    },
    {
      label: 'Avg Time to First Purchase',
      value:
        avgTimeToFirstPurchase < 1
          ? `${Math.round(avgTimeToFirstPurchase * 60)}m`
          : avgTimeToFirstPurchase < 24
            ? `${avgTimeToFirstPurchase.toFixed(1)}h`
            : `${(avgTimeToFirstPurchase / 24).toFixed(1)}d`,
      description: 'From first visit to purchase',
      icon: Clock,
      iconColor: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    },
    {
      label: 'Customer Lifetime Value',
      value: `$${customerLifetimeValue.toFixed(2)}`,
      description: 'Average revenue per customer',
      icon: DollarSign,
      iconColor: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950/30',
    },
    {
      label: 'Repeat Purchase Rate',
      value: `${repeatPurchaseRate.toFixed(1)}%`,
      description: 'Customers who purchased multiple times',
      icon: RefreshCw,
      iconColor: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-950/30',
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversion Metrics</CardTitle>
        <CardDescription>
          Funnel performance and customer behavior insights
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-muted animate-pulse rounded" />
                <div className="h-8 bg-muted animate-pulse rounded" />
                <div className="h-3 bg-muted animate-pulse rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric) => (
              <div key={metric.label} className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-md ${metric.bgColor}`}>
                    <metric.icon
                      className={`h-3.5 w-3.5 ${metric.iconColor}`}
                    />
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">
                    {metric.label}
                  </p>
                </div>
                <p className="text-2xl font-bold">{metric.value}</p>
                <p className="text-xs text-muted-foreground">
                  {metric.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
