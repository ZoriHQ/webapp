import { renderChangeIndicator } from './helpers'
import { ErrorTile } from './error.tile'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppContext } from '@/contexts/app.context'
import { useSessionDurationTile } from '@/hooks/use-analytics-tiles'
import { formatDuration } from '@/lib/utils'

export const SessionDurationTile = () => {
  const { storedValues } = useAppContext()
  const { isLoading, data, isError } = useSessionDurationTile({
    time_range: storedValues?.timeRange || 'last_7_days',
    project_id: storedValues!.projectId as string,
  })

  const currentDuration = data?.avg_duration ?? 0
  const previousDuration = data?.previous_avg_duration ?? 0

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Avg Session Duration
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
              {formatDuration(currentDuration)}
            </div>
            {renderChangeIndicator({
              current: currentDuration,
              previous: previousDuration,
              trendDirection: 'up-good',
              formatter: formatDuration,
            })}
          </>
        )}
      </CardContent>
    </Card>
  )
}
