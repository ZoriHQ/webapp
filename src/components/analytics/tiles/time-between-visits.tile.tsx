import { formatHours, renderChangeIndicator } from './helpers'
import { ErrorTile } from './error.tile'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppContext } from '@/contexts/app.context'
import { useTimeBetweenVisitsTile } from '@/hooks/use-analytics-tiles'

export const TimeBetweenVisitsTile = () => {
  const { storedValues } = useAppContext()
  const { isLoading, data, isError } = useTimeBetweenVisitsTile({
    time_range: storedValues?.timeRange || 'last_7_days',
    project_id: storedValues!.projectId as string,
  })

  const currentHours = data?.avg_hours ?? 0
  const previousHours = data?.previous_avg_hours ?? 0

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Time Between Visits
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isError && <ErrorTile />}
        {isLoading ? (
          <div className="text-2xl font-bold text-muted-foreground">
            Loading...
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">
              {formatHours(currentHours)}
            </div>
            {renderChangeIndicator({
              current: currentHours,
              previous: previousHours,
              trendDirection: 'down-good',
              formatter: formatHours,
            })}
          </>
        )}
      </CardContent>
    </Card>
  )
}
