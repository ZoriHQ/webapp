import { IconArrowDown, IconArrowUp } from '@tabler/icons-react'
import type { Zoriapi } from 'zorihq'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface LlmMetricsCardsProps {
  costData: Zoriapi.V1.Analytics.LlmCostResponse | undefined
  tracesData: Zoriapi.V1.Analytics.LlmTracesListResponse | undefined
  isLoadingCost: boolean
  isLoadingTraces: boolean
}

export function LlmMetricsCards({
  costData,
  tracesData,
  isLoadingCost,
  isLoadingTraces,
}: LlmMetricsCardsProps) {
  const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return '$0.00'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(value)
  }

  const formatNumber = (value: number | undefined) => {
    if (value === undefined) return '0'
    return new Intl.NumberFormat('en-US').format(value)
  }

  const calculateChange = (current?: number, previous?: number) => {
    if (!current || !previous || previous === 0) return null
    return ((current - previous) / previous) * 100
  }

  const costChange = calculateChange(costData?.cost, costData?.previous_cost)

  // Calculate totals from traces
  const totalTokens =
    tracesData?.traces?.reduce(
      (sum, trace) => sum + (trace.total_tokens || 0),
      0,
    ) || 0

  const avgLatency =
    tracesData?.traces && tracesData.traces.length > 0
      ? tracesData.traces.reduce(
          (sum, trace) => sum + (trace.avg_latency_ms || 0),
          0,
        ) / tracesData.traces.length
      : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Total Cost */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Cost
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingCost ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <>
              <div className="text-2xl font-bold">
                {formatCurrency(costData?.cost)}
              </div>
              {costChange !== null && (
                <div
                  className={`flex items-center text-xs mt-1 ${
                    costChange > 0 ? 'text-red-500' : 'text-green-500'
                  }`}
                >
                  {costChange > 0 ? (
                    <IconArrowUp className="h-3 w-3 mr-1" />
                  ) : (
                    <IconArrowDown className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(costChange).toFixed(1)}% vs previous period
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Total Traces */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Traces
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingTraces ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <div className="text-2xl font-bold">
              {formatNumber(tracesData?.total)}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Total Tokens */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Tokens
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingTraces ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <>
              <div className="text-2xl font-bold">
                {formatNumber(totalTokens)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Input + Output
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Avg Latency */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Avg Latency
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingTraces ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <>
              <div className="text-2xl font-bold">
                {avgLatency > 1000
                  ? `${(avgLatency / 1000).toFixed(2)}s`
                  : `${avgLatency.toFixed(0)}ms`}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Response time
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
