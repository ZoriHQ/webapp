import { formatRate, renderChangeIndicator } from './helpers'
import { ErrorTile } from './error.tile'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppContext } from '@/contexts/app.context'
import { useBounceRateTile } from '@/hooks/use-analytics-tiles'

export const BounceRateTile = () => {
  const { storedValues } = useAppContext()
  const { isLoading, data, isError } = useBounceRateTile({
    time_range: storedValues?.timeRange || 'last_7_days',
    project_id: storedValues!.projectId as string,
  })

  const currentRate = data?.rate ?? 0
  const previousRate = data?.previous_rate ?? 0

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
      </CardHeader>
      <CardContent>
        {isError && <ErrorTile />}
        {isLoading ? (
          <div className="text-2xl font-bold text-muted-foreground">
            Loading...
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">{formatRate(currentRate)}</div>
            {renderChangeIndicator({
              current: currentRate,
              previous: previousRate,
              trendDirection: 'down-good',
              formatter: (val) => `${val.toFixed(1)}%`,
            })}
          </>
        )}
      </CardContent>
    </Card>
  )
}
