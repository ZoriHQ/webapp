import { IconArrowDown, IconArrowUp } from '@tabler/icons-react'
import type { Zoriapi } from 'zorihq'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface LlmTopModelsProps {
  data: Zoriapi.V1.Analytics.LlmTopModelsCostResponse | undefined
  isLoading: boolean
}

export function LlmTopModels({ data, isLoading }: LlmTopModelsProps) {
  const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return '$0.00'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(value)
  }

  const calculateChange = (current?: number, previous?: number) => {
    if (!current || !previous || previous === 0) return null
    return ((current - previous) / previous) * 100
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Models by Cost</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const models = data?.data || []

  if (models.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Models by Cost</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground text-sm">
            No model data available
          </div>
        </CardContent>
      </Card>
    )
  }

  // Calculate total for percentage
  const totalCost = models.reduce((sum, m) => sum + (m.cost || 0), 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Models by Cost</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {models.map((model, index) => {
            const change = calculateChange(model.cost, model.previous_cost)
            const percentage =
              totalCost > 0 ? ((model.cost || 0) / totalCost) * 100 : 0

            return (
              <div key={model.model || index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium truncate max-w-[60%]">
                    {model.model?.split('/').pop() || model.model || 'Unknown'}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono">
                      {formatCurrency(model.cost)}
                    </span>
                    {change !== null && (
                      <span
                        className={`flex items-center text-xs ${
                          change > 0 ? 'text-red-500' : 'text-emerald-600'
                        }`}
                      >
                        {change > 0 ? (
                          <IconArrowUp className="h-3 w-3" />
                        ) : (
                          <IconArrowDown className="h-3 w-3" />
                        )}
                        {Math.abs(change).toFixed(0)}%
                      </span>
                    )}
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
